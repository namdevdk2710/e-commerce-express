"use strict";

const express = require("express");
const CartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.post("", asyncHandler(CartController.addToCart));
router.delete("", asyncHandler(CartController.deleteCart));
router.post("/update", asyncHandler(CartController.updateCart));
router.get("", asyncHandler(CartController.listToCart));

module.exports = router;
