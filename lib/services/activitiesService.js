"use strict";

var _require = require("../utils/Request"),
    request = _require.request;

var producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080"
};

exports.createActivity = function (activityDetails) {
  var formData = new FormData();
  Object.keys(activityDetails).forEach(function (property) {
    if (!activityDetails[property]) {
      return;
    }

    formData.append(property, activityDetails[property]);
  });
  formData.append("supportingFile", new File(["Hola Mundo!"], "supporting_file1.txt"));
  formData.append("supportingFile", new File(["Hola Mundo2!"], "supporting_file2.txt"));
  return request({
    url: "http://".concat(producer.base_url, "/api/courses/").concat(activityDetails.courseId, "/activities"),
    body: formData,
    method: "POST",
    headers: new Headers()
  });
};

exports.getActivityCategories = function (courseId) {
  return request({
    url: "http://".concat(producer.base_url, "/api/courses/").concat(courseId, "/activityCategories"),
    method: "GET"
  });
};

exports.getAllActivities = function (courseId) {
  return request({
    url: "http://".concat(producer.base_url, "/api/courses/").concat(courseId, "/activities"),
    method: "GET"
  });
};

exports.getActivity = function (courseId, activityId) {
  return request({
    url: "http://".concat(producer.base_url, "/api/courses/").concat(courseId, "/activities/").concat(activityId),
    method: "GET"
  });
};