"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../models/inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inventory_product_id: new Types.ObjectId(productId),
    inventory_shop_id: new Types.ObjectId(shopId),
    inventory_stock: stock,
    inventory_location: location,
  });
};

module.exports = {
  insertInventory,
};
