"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  static createProduct = async (req, res) => {
    const { product_type, ...payload } = req.body;
    new SuccessResponse({
      message: "Create new Product success!",
      data: await ProductService.createProduct(product_type, payload),
    }).send(res);
  };
}

module.exports = ProductController;
