"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/shop/signup", asyncHandler(AccessController.signup));
router.post("/shop/login", asyncHandler(AccessController.login));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(AccessController.handlerRefreshToken)
);

module.exports = router;
