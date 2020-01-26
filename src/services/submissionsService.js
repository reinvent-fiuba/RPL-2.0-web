// @flow
const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080"
};

exports.createSubmission = (
  courseId: number,
  activityId: number,
  code: string
) => {
  const formData = new FormData();


  formData.append("file", new File([code], "main.c"));
  formData.append("description", "La descriptionnnnnn");

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    body: formData,
    method: "POST",
    headers: new Headers()
  });
};
