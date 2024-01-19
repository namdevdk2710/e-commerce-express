"use strict";

const redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscribe = redis.createClient();
    this.publish = redis.createClient();
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publish(channel, message, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  subscriber(channel, callback) {
    this.subscribe.subscribe(channel);

    this.subscribe.on("message", (subscriberChannel, message) => {
      if (subscriberChannel === channel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = RedisPubSubService;
