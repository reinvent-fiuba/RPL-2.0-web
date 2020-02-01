"use strict";

var _require = require("../utils/Request"),
    request = _require.request;

var producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080"
};

exports.login = function (credentials) {
  return request({
    url: "http://".concat(producer.base_url, "/api/auth/login"),
    body: JSON.stringify(credentials),
    method: "POST"
  });
};

exports.signup = function (user) {
  return request({
    url: "http://".concat(producer.base_url, "/api/auth/signup"),
    body: JSON.stringify(user),
    method: "POST"
  });
};

exports.getProfile = function () {
  return request({
    url: "http://".concat(producer.base_url, "/api/auth/profile"),
    method: "GET"
  });
};