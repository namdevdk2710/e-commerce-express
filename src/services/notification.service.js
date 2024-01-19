"use strict";

const Notification = require("../models/notification.model");

class NotificationService {
  static async pushNotificationToSystem({
    type = "SHOP-001",
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let notificationContent;
    if (type === "SHOP-001") {
      notificationContent = `Shop @@@ created a new product: @@@`;
    } else if (type === "PROMOTION-001") {
      notificationContent = `Shop @@@ created a new voucher: @@@`;
    }

    return await Notification.create({
      notificationContent,
      notificationType: type,
      notificationSenderId: senderId,
      notificationReceivedId: receivedId,
      notificationOptions: options,
    });
  }

  static async listNotificationByUser({
    userId = 1,
    type = "ALL",
    isRead = 0,
  }) {
    const match = { notificationReceivedId: userId };
    if (type !== "ALL") {
      match.notificationType = type;
    }

    return await Notification.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          notificationType: 1,
          notificationSenderId: 1,
          notificationReceivedId: 1,
          notificationContent: {
            $concat: [
              {
                $substr: ["$notificationOptions.shopName", 0, -1],
              },
              " created a new product: ",
              {
                $substr: ["$notificationOptions.productName", 0, -1],
              },
            ],
          },
          notificationOptions: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
