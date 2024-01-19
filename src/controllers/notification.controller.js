"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  static listNotificationByUser = async (req, res) => {
    new SuccessResponse({
      message: "Get Notification success!",
      data: await NotificationService.listNotificationByUser(req.body),
    }).send(res);
  };
}

module.exports = NotificationController;
