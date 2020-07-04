// @flow
import type { SubmissionResult } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.getMySubmissionsStats = (courseId: number): Promise<> =>
  request({
    url: `http://${producer.base_url}/api/stats/courses/${courseId}/submissions/me`,
    method: "GET",
  });

exports.getMyActivitiesStats = (courseId: number): Promise<> =>
  request({
    url: `http://${producer.base_url}/api/stats/courses/${courseId}/activities/me`,
    method: "GET",
  });

exports.getSubmissionStatsByDate = (courseId: number): Promise<> => 
  request({
    url: `http://${producer.base_url}/api/stats/courses/${courseId}/submissions?groupBy=date`,
    method: "GET",
  });

exports.getSubmissionStatsByActivity = (courseId: number, categoryId: number, studentId: number): Promise<> => {
  const categoryIdParam = (categoryId && `&categoryId=${categoryId}`) || "";
  const studentIdParam = (studentId && `&userId=${studentId}`) || "";
  return request({
    url: `http://${producer.base_url}/api/stats/courses/${courseId}/submissions?groupBy=activity${studentIdParam}${categoryIdParam}`,
    method: "GET",
  });
};

exports.getSubmissionStatsByStudent = (courseId: number, date: string): Promise<> => 
  request({
    url: `http://${producer.base_url}/api/stats/courses/${courseId}/submissions?groupBy=user${
      date ? `&date=${date}` : ""
    }`,
    method: "GET",
  });
