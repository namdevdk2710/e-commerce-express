const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    inventory_product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    inventory_location: { type: String, default: "unknown" },
    inventory_stock: { type: Number, required: true },
    inventory_shop_id: { type: Schema.Types.ObjectId, ref: "Shop" },
    inventory_reservation: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
