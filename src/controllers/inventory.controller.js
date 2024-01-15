"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  static addStockToInventory = async (req, res) => {
    new SuccessResponse({
      message: "Create new InventoryControllers!",
      data: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = InventoryController;
