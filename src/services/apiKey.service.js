"use strict";

const crypto = require("node:crypto");
const apiKeyModel = require("../models/apiKey.model");

const findById = async (key) => {
  // await apiKeyModel.create({key: crypto.randomBytes(64).toString("hex"), permissions: ['0000']});
  const object = await apiKeyModel.findOne({ key, status: true }).lean();
  return object;
};

module.exports = { findById };
