"use strict";

const { ForbiddenError } = require("../core/error.response");
const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  const apiKey = req.headers[HEADER.API_KEY];
  if (!apiKey) {
    return res.status(403).json({
      message: "Forbidden Error",
    });
  }

  // check object
  const objKey = await findById(apiKey);
  if (!objKey) {
    return res.status(403).json({
      message: "Forbidden Error",
    });
  }
  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

module.exports = { apiKey, permission };
