"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/notifications", require("./notification"));
router.use("/v1/api/comments", require("./comment"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/carts", require("./cart"));
router.use("/v1/api/products", require("./product"));
router.use("/v1/api/discounts", require("./discount"));
router.use("/v1/api", require("./access"));

module.exports = router;
