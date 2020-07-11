// @flow
import type { SubmissionResult } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "http://localhost:8080",
};

exports.createSubmission = (courseId: number, activityId: number, code: { [string]: string }) => {
  const formData = new FormData();

  Object.keys(code).forEach(filename => {
    formData.append("file", new File([code[filename]], filename));
    formData.append("description", "La descriptionnnnnn");
  });

  return request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    body: formData,
    method: "POST",
    headers: new Headers(),
  });
};

exports.getSubmissionResult = (submissionId: number): Promise<SubmissionResult> =>
  request({
    url: `${producer.base_url}/api/submissions/${submissionId}/result`,
    method: "GET",
  }).then(submission => {
    return fetch(`${producer.base_url}/api/getExtractedFile/${submission.submission_file_id}`).then(
      response => {
        return response.json().then(code => {
          const completeSubmission = submission;
          completeSubmission.submited_code = code;
          return completeSubmission;
        });
      }
    );
  });

exports.getAllSubmissions = (
  courseId: number,
  activityId: number
): Promise<Array<SubmissionResult>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
    method: "GET",
  });

exports.getAllSubmissionsFromStudent = (
  courseId: number,
  activityId: number,
  studentId: number
): Promise<Array<SubmissionResult>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/students/${studentId}/submissions`,
    method: "GET",
  });

exports.getStats = (courseId: number): Promise<> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/submissions/stats`,
    method: "GET",
  });

exports.getFinalSolution = (courseId: number, activityId: number): Promise<SubmissionResult> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/finalSubmission`,
    method: "GET",
  });

exports.getFinalSolutionWithFile = (
  courseId: number,
  activityId: number
): Promise<SubmissionResult> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/finalSubmission`,
    method: "GET",
  }).then(submission => {
    return fetch(`${producer.base_url}/api/getExtractedFile/${submission.submission_file_id}`).then(
      response => {
        return response.json().then(code => {
          const completeSubmission = submission;
          completeSubmission.submited_code = code;
          return completeSubmission;
        });
      }
    );
  });

exports.getAllFinalSolutionsFiles = (
  courseId: number,
  activityId: number
): Promise<Array<{ [string]: string }>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/allFinalSubmissions`,
    method: "GET",
  }).then(response =>
    request({
      url: `${producer.base_url}/api/getExtractedFiles/${response.submission_file_ids}`,
      method: "GET",
    })
  );

exports.putSolutionAsFinal = (
  courseId: number,
  activityId: number,
  submissionId: number
): Promise<SubmissionResult> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions/${submissionId}/final`,
    method: "PUT",
  });
