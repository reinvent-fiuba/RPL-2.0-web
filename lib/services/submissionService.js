"use strict";

var _require = require("../utils/Request"),
    request = _require.request;

var producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080"
};

exports.submit = function (usernameOrMail, password) {
  return request({
    url: "http://".concat(producer.base_url, "/api/health"),
    method: "POST",
    body: JSON.stringify({
      usernameOrMail: usernameOrMail,
      password: password
    })
  });
};