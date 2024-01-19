"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    commentProductId: { type: Schema.Types.ObjectId, ref: "Product" },
    commentUserId: { type: Number, default: 1 },
    commentContent: { type: String, default: "Text" },
    commentLeft: { type: Number, default: 0 },
    commentRight: { type: Number, default: 0 },
    commentParentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema);
