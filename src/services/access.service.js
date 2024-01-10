"use strict";

const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const shopModel = require("../models/shop.model");
const { createKeyToken, removeKeyById } = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const KeyTokenService = require("./keyToken.service");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened. Please re-login!");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not register!");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not register!");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await removeKeyById(keyStore);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error!");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  /**
   * 1. check email exist
   * 2. create new shop
   * 3. created key token
   */
  static signup = async ({ name, email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) throw new BadRequestError("Shop already registered!");

    // step 2: create new shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (!newShop) throw new BadRequestError("Register shop error!");

    // step 3: created key token
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey
    );

    const keyStore = await createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    if (!keyStore) throw new BadRequestError("KeyStore error!");

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: newShop,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
