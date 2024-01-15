"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  static addToCart = async (req, res) => {
    new CREATED({
      message: "Create new Cart success!",
      data: await CartService.addToCart(req.body),
    }).send(res);
  };

  static updateCart = async (req, res) => {
    new SuccessResponse({
      message: "Update Cart success!",
      data: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  static deleteCart = async (req, res) => {
    new SuccessResponse({
      message: "Delete Cart success!",
      data: await CartService.deleteItemUserCart(req.body),
    }).send(res);
  };

  static listToCart = async (req, res) => {
    new SuccessResponse({
      message: "Get Cart success!",
      data: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = CartController;
