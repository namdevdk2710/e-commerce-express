"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  static handlerRefreshToken = async (req, res) => {
    new SuccessResponse({
      message: "Get token success!",
      data: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  static logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout success!",
      data: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  static login = async (req, res) => {
    new SuccessResponse({
      data: await AccessService.login(req.body),
    }).send(res);
  };

  static signup = async (req, res) => {
    new CREATED({
      message: "Register OK!",
      data: await AccessService.signup(req.body),
    }).send(res);
  };
}

module.exports = AccessController;
