"use strict";

const { product, electronic, clothing } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

// define Factory class to create product
class ProductFactory {
  /**
   * @param type - product type
   * @param payload
   * */
  static createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload);
      case "Clothing":
        return new Clothing(payload);
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`);
    }
  }
}

// define base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct() {
    return await product.create(this);
  }
}

// define child classes for product type clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

// define child classes for product type electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

module.exports = ProductFactory;
