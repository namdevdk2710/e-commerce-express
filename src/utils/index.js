"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnselectData = (select) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefinedObject,
};
