"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.get("", asyncHandler(ProductController.getAllProducts));
router.get("/detail/:id", asyncHandler(ProductController.getProduct));
router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.searchProducts)
);

// authentication
router.use(authentication);

router.post("", asyncHandler(ProductController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unpublishProductByShop)
);

router.patch("/:id", asyncHandler(ProductController.updateProduct));

// Query products
router.get("/drafts", asyncHandler(ProductController.getAllDraftsForShop));
router.get("/publish", asyncHandler(ProductController.getAllPublishForShop));

module.exports = router;
