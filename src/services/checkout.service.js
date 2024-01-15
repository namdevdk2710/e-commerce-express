"use strict";

const cart = require("../models/cart.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../repositories/product.repo");
const order = require("../models/order.model");
const { findCartById } = require("../repositories/cart.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  static checkoutReview = async ({ cartId, userId, shopOrderIds = [] }) => {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart not found");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shopOrderIdsNew = [];

    for (let index = 0; index < shopOrderIds.length; index++) {
      const { shopId, shopDiscounts = [], items = [] } = shopOrderIds[index];
      const checkProductServer = await checkProductByServer(items);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!");

      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        items: checkProductServer,
      };

      if (shopDiscounts.length > 0) {
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            userId,
            shopId,
            code: shopDiscounts[0].code,
            products: checkProductServer,
          });

        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemCheckout);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkoutOrder,
    };
  };

  static orderByUser = async ({
    userId,
    cartId,
    shopOrderIds,
    userAddress = {},
    userPayment = {},
  }) => {
    const { shopOrderIdsNew, checkoutOrder } =
      await CheckoutService.checkoutReview({ cartId, userId, shopOrderIds });

    const products = shopOrderIdsNew.flatMap((order) => order.items);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Some products are out of stock!");
    }

    const newOrder = await order.create({
      orderUserId: userId,
      orderCheckout: checkoutOrder,
      orderShipping: userAddress,
      orderPayment: userPayment,
      orderProducts: shopOrderIdsNew,
    });

    if (newOrder) {
      // remove cart
    }

    return newOrder;
  };

  static async getOrdersByUser({ userId, page = 1, limit = 10 }) {}

  static async getOrderByUser({ userId, page = 1, limit = 10 }) {}
  
  static async cancelOrderByUser({ userId, page = 1, limit = 10 }) {}
 
  static async updateOrderStatusByShop({ userId, page = 1, limit = 10 }) {}
}

module.exports = CheckoutService;
