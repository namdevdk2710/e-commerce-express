"use strict";

const cart = require("../models/cart.model");
const { NotFoundError } = require("../core/error.response");
const { findProduct } = require("../repositories/product.repo");
const order = require("../models/order.model");

class InventoryService {
  static addStockToInventory = async ({ stock, productId, shopId, location = '123 Son Tra, DN' }) => {
    const product = await findProduct({ product_id: productId });
    if (!product) throw new NotFoundError("Product not found");

    const query = {
      inventory_product_id: product._id,
      inventory_shop_id: shopId,
    };
    const updateSet = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };
    const options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  };
}

module.exports = InventoryService;
