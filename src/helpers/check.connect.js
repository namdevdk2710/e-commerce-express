"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    const maxConnection = numCores * 5;

    if (numConnection > maxConnection) {
      console.log(`Connection overload: ${numConnection} > ${maxConnection}`);
    }
  }, _SECOND);
};

module.exports = { countConnect, checkOverload };
