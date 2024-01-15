const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cartState: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cartProduct: { type: Array, required: true, default: [] },
    cartCountProduct: { type: Number, default: 0 },
    cartUserId: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
