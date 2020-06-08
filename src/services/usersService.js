// @flow

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.findUsers = query =>
  request({
    url: `http://${producer.base_url}/api/users?query=${query}`,
    method: "GET",
  });
