"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  static createProduct = async (req, res) => {
    new CREATED({
      message: "Create new Product success!",
      data: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static updateProduct = async (req, res) => {
    new SuccessResponse({
      message: "Update product success!",
      data: await ProductService.updateProduct(
        req.body.product_type,
        req.params.id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  static publishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Publish product success!",
      data: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  static unpublishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Unpublish product success!",
      data: await ProductService.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  static getAllDraftsForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      data: await ProductService.findAllDraftsForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static getAllPublishForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get list Publish success!",
      data: await ProductService.findAllPublishForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static searchProducts = async (req, res) => {
    new SuccessResponse({
      message: "Search products success!",
      data: await ProductService.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  static getAllProducts = async (req, res) => {
    new SuccessResponse({
      message: "Get All Products success!",
      data: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  static getProduct = async (req, res) => {
    new SuccessResponse({
      message: "Get Product success!",
      data: await ProductService.findByProduct({ product_id: req.params.id }),
    }).send(res);
  };
}

module.exports = ProductController;
