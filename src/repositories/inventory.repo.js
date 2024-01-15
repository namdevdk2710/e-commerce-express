"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../models/inventory.model");
const { convertToObjectId } = require("../utils");

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

const reservationInventory = async ({ productId, shopId, quantity }) => {
  const query = {
    inventory_product_id: convertToObjectId(productId),
    inventory_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: { inventory_stock: -quantity },
    $push: {
      inventory_reservation: { quantity, cartId, createdAt: new Date() },
    },
  };
  const options = { new: true, upsert: true };

  return await inventory.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory
};
