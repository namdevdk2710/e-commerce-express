"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  static createComment = async (req, res) => {
    new CREATED({
      message: "Create comment success!",
      data: await CommentService.createComment(req.body),
    }).send(res);
  };

  static getCommentsByParentId = async (req, res) => {
    new SuccessResponse({
      message: "Get comment success!",
      data: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };

  static deleteComment = async (req, res) => {
    new SuccessResponse({
      message: "Delete comment success!",
      data: await CommentService.deleteComment(req.query),
    }).send(res);
  };
}

module.exports = CommentController;
