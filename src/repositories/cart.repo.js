"use strict";

const cart = require("../models/cart.model");
const { convertToObjectId } = require("../utils");

const findCartById = async (cartId) => {
  return await cart
    .findOne({ _id: convertToObjectId(cartId), cartState: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
