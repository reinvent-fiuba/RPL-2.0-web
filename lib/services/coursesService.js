"use strict";

var _require = require('../utils/Request'),
    request = _require.request;

var producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080'
};

exports.create = function (courseDetails) {
  return request({
    url: "http://".concat(producer.base_url, "/api/courses"),
    body: JSON.stringify(courseDetails),
    method: 'POST'
  });
};

exports.getAll = function () {
  return request({
    url: "http://".concat(producer.base_url, "/api/courses"),
    method: 'GET'
  });
};

exports.getAllByUser = function (userId) {
  return request({
    url: "http://".concat(producer.base_url, "/api/users/").concat(userId, "/courses"),
    method: 'GET'
  });
};