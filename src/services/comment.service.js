"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { findProduct } = require("../repositories/product.repo");
const { convertToObjectId } = require("../utils");

class CommentService {
  static async createComment({ productId, userId, content, parentId = null }) {
    const comment = new Comment({
      commentProductId: productId,
      commentUserId: userId,
      commentContent: content,
      commentParentId: parentId,
    });

    let rightValue = 1;
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.commentRight;

      await Comment.updateMany(
        {
          commentProductId: convertToObjectId(productId),
          commentRight: { $gt: rightValue },
        },
        {
          $inc: { commentRight: 2 },
        }
      );

      await Comment.updateMany(
        {
          commentProductId: convertToObjectId(productId),
          commentRight: { $gte: rightValue },
        },
        {
          $inc: { commentLeft: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          commentProductId: convertToObjectId(productId),
        },
        "commentRight",
        { sort: { commentRight: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.commentRight + 1;
      }
    }

    comment.commentLeft = rightValue;
    comment.commentRight = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) throw new NotFoundError("Parent comment not found");

      return await Comment.find({
        commentProductId: convertToObjectId(productId),
        commentLeft: { $gt: parent.commentLeft },
        commentRight: { $gt: parent.commentRight },
      })
        .select({
          commentLeft: 1,
          commentRight: 1,
          commentContent: 1,
          commentParentId: 1,
        })
        .sort({
          commentLeft: 1,
        })
        .skip(offset)
        .limit(limit);
    }

    return await Comment.find({
      commentProductId: convertToObjectId(productId),
      commentParentId: parentId,
    })
      .select({
        commentLeft: 1,
        commentRight: 1,
        commentContent: 1,
        commentParentId: 1,
      })
      .sort({
        commentLeft: 1,
      })
      .skip(offset)
      .limit(limit);
  }

  static async deleteComment({ productId, commentId }) {
    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.commentLeft;
    const rightValue = comment.commentRight;

    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      commentProductId: convertToObjectId(productId),
      commentLeft: { $gte: leftValue, $lte: rightValue },
     });

    await Comment.updateMany(
      {
        commentProductId: convertToObjectId(productId),
        commentRight: { $gt: rightValue },
      },
      {
        $inc: { commentRight: -width },
      }
    );

    await Comment.updateMany(
      {
        commentProductId: convertToObjectId(productId),
        commentLeft: { $gt: leftValue },
      },
      {
        $inc: { commentLeft: -width },
      }
    );

    return true;
  }
}

module.exports = CommentService;
