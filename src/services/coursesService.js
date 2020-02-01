// @flow
import type { Course, CreateCourseProps } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.create = (courseDetails: CreateCourseProps) =>
  request({
    url: `http://${producer.base_url}/api/courses`,
    body: JSON.stringify(courseDetails),
    method: "POST",
  });

exports.getAll = (): Promise<Array<Course>> =>
  request({
    url: `http://${producer.base_url}/api/courses`,
    method: "GET",
  });

exports.getAllByUser = (userId: number): Promise<Array<Course>> =>
  request({
    url: `http://${producer.base_url}/api/users/${userId}/courses`,
    method: "GET",
  });
