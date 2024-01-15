"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../repositories/inventory.repo");

const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setNxAsync(key, expireTime);
    if (result === 1) {
      // thao tac inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (!isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return await delAsync(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
