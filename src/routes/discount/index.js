"use strict";

const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get("/list-product-code", asyncHandler(DiscountController.getAllDiscountCodesWithProducts));

// authentication
router.use(authentication);

router.post("", asyncHandler(DiscountController.createDiscountCode));
router.get("", asyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;
