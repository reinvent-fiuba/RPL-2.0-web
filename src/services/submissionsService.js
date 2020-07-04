// @flow
import type { SubmissionResult } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.createSubmission = (courseId: number, activityId: number, code: { [string]: string }) => {
  const formData = new FormData();

  Object.keys(code).forEach(filename => {
    formData.append("file", new File([code[filename]], filename));
    formData.append("description", "La descriptionnnnnn");
  });

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
  }).then(submission => {
    return fetch(
      `http://localhost:8080/api/getExtractedFile/${submission.submission_file_id}`
    ).then(response => {
      return response.json().then(code => {
        const completeSubmission = submission;
        completeSubmission.submited_code = code;
        return completeSubmission;
      });
    });
  });

exports.getAllSubmissions = (
  courseId: number,
  activityId: number
): Promise<Array<SubmissionResult>> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    method: "GET",
  });
