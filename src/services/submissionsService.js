// @flow
import type { SubmissionResult } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.createSubmission = (
  courseId: number,
  activityId: number,
  code: string,
  filename: string
) => {
  const formData = new FormData();

  formData.append("file", new File([code], filename));
  formData.append("description", "La descriptionnnnnn");

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    body: formData,
    method: "POST",
    headers: new Headers(),
  });
};

exports.getSubmissionResult = (submissionId: number): Promise<SubmissionResult> =>
  request({
    url: `http://${producer.base_url}/api/submissions/${submissionId}/result`,
    method: "GET",
  });

exports.getAllSubmissions = (
  courseId: number,
  activityId: number
): Promise<Array<SubmissionResult>> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    method: "GET",
  });
