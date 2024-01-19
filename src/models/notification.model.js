"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    notificationSenderId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    notificationReceivedId: { type: Number, required: true },
    notificationContent: { type: String, default: 0 },
    notificationOptions: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
