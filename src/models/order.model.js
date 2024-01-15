const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    orderUserId: { type: Number, required: true },
    orderCheckout: { type: Object, default: {} },
    orderShipping: { type: Object, default: {} },
    orderPayment: { type: Object, default: {} },
    orderProducts: { type: Array, required: true },
    orderTrackingNumber: { type: String, default: "#0000115012024" },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
