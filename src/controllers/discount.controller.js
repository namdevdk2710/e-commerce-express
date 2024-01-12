"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  static createDiscountCode = async (req, res) => {
    new SuccessResponse({
      message: "Successful code generation!",
      data: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  static getAllDiscountCodes = async (req, res) => {
    new SuccessResponse({
      message: "Get all discount codes success!",
      data: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  static getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: "Get Discount Amount success!",
      data: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  static getAllDiscountCodesWithProducts = async (req, res) => {
    new SuccessResponse({
      message: "Get All Discount Codes With Products success!",
      data: await DiscountService.getAllDiscountCountsWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = DiscountController;
