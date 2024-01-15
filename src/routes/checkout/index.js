"use strict";

const express = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
