"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../repositories/discount.repo");
const { findAllProducts } = require("../repositories/product.repo");
const { convertToObjectId } = require("../utils");

// define Factory class to create product
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      shop_id,
    } = payload;
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date!");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shop_id: convertToObjectId(shop_id),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    return await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value || 0,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_shop_id: convertToObjectId(shop_id),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
  }

  static async updateDiscountCode(payload) {
    // ...
  }

  static async getAllDiscountCountsWithProduct({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code is not exist!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      return await findAllProducts({
        filter: { product_shop: convertToObjectId(shopId), isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else {
      return await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    return await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToObjectId(shopId),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
      model: discount,
    });
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code does not exist!");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount;
    if (!discount_is_active) {
      throw new BadRequestError("Discount code expired!");
    }

    if (!discount_max_uses) throw new BadRequestError("Discount code are out!");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount requires a minimum order value of ${discount_min_order_value}!`
        );
      }
    }

    if (discount_max_uses_per_user > 0 && discount_users_used) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.user_id === userId
      );
      if (userUseDiscount) {
        // ...
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, code }) {
    return await discount.findOneAndDelete({
      discount_shop_id: convertToObjectId(shopId),
      discount_code: code,
    });
  }

  static async cancelDiscountCode({ shopId, code, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_shop_id: convertToObjectId(shopId),
        discount_code: code,
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code does not exist!");
    }

    return await discount.findOneAndUpdate({
      $pull: { discount_users_used: userId },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = DiscountService;
