"use strict";

const cart = require("../models/cart.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findProduct } = require("../repositories/product.repo");

class CartService {
  static createUserCart = async ({ userId, product = {} }) => {
    const query = { cartUserId: userId, cartState: "active" };
    const updateOrInsert = {
      $addToSet: {
        cartProduct: product,
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  };

  static updateUserCartQuantity = async ({ userId, product = {} }) => {
    const { productId, quantity } = product;
    const query = {
      cartUserId: userId,
      "cartProduct.productId": productId,
      cartState: "active",
    };
    const updateSet = {
      $inc: {
        "cartProduct.$.quantity": quantity,
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  };

  static addToCart = async ({ userId, product = {} }) => {
    const userCart = await cart.findOne({ cartUserId: userId });
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (!userCart.cartProduct.length) {
      userCart.cartProduct.push(product);
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  };

  static addToCartV2 = async ({ userId, products = [] }) => {
    const { productId, quantity, oldQuantity } = products[0].items;
    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct) throw new NotFoundError("Product not found");

    if (foundProduct.product_shop.toString() !== products[0].shopId) {
      throw new BadRequestError("Product does not belong to the shop");
    }

    if (quantity === 0) {
      return await CartService.deleteItemUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  };

  static deleteItemUserCart = async ({ userId, productId }) => {
    const query = { cartUserId: userId, cartState: "active" };
    const updateSet = {
      $pull: {
        cartProduct: {
          productId,
        },
      },
    };

    return await cart.updateOne(query, updateSet);
  };

  static getListUserCart = async ({ userId }) => {
    return await cart.findOne({ cartUserId: userId }).lean();
  };
}

module.exports = CartService;
