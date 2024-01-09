"use strict";

const dev = {
  app: {
    port: process.env.APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "e-commerce",
  },
};

const pro = {
  app: {
    port: process.env.APP_PORT || 3000,
  },
  db: {
    host: process.env._PRO_DB_HOST || "localhost",
    port: process.env._PRO_DB_PORT || 27017,
    name: process.env._PRO_DB_NAME || "e-commerce-pro",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
