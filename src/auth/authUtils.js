"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.log(`err: ${err}`);
    } else {
      console.log(`decode: ${decode}`);
    }
  });

  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError("Not found keystore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
  if (userId !== decodeUser.userId) {
    throw new AuthFailureError("Invalid UserId");
  }

  req.keyStore = keyStore;
  return next();
});

const verifyJWT = async (token, secretKey) => {
  console.log(11111, token, secretKey);
  return await JWT.verify(token, secretKey);
};

module.exports = { createTokenPair, authentication, verifyJWT };
