"use strict";

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static checkoutReview = async (req, res) => {
    new SuccessResponse({
      message: "Checkout Review success!",
      data: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = CheckoutController;
