// @flow
import type { Course, CreateCourseProps } from "../types";

const _ = require('lodash');
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
  }).then(courses => courses.map(course => _.extend(course, { enrolled: true })));

exports.enroll = (courseId: number) =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/enroll`,
    method: "POST",
  });

exports.unenroll = (courseId: number) =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/unenroll`,
    method: "POST",
  });
