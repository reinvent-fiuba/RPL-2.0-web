// @flow
import type { Course, Student } from "../types";

const _ = require("lodash");
const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "http://localhost:8080",
};

exports.create = (
  name: string,
  university: string,
  universityCourseId: string,
  semester: string,
  semesterStartDate: string,
  semesterEndDate: string,
  courseAdminId: string,
  description: string,
  imgUri: string
) =>
  request({
    url: `${producer.base_url}/api/courses`,
    body: JSON.stringify({
      name,
      university,
      university_course_id: universityCourseId,
      semester,
      semester_start_date: semesterStartDate,
      semester_end_date: semesterEndDate,
      course_admin_id: courseAdminId,
      description,
      img_uri: imgUri,
    }),
    method: "POST",
  });

exports.edit = (
  id: string,
  name: string,
  university: string,
  universityCourseId: string,
  semester: string,
  semesterStartDate: string,
  semesterEndDate: string,
  description: string,
  imgUri: string
) =>
  request({
    url: `${producer.base_url}/api/courses/${id}`,
    body: JSON.stringify({
      name,
      university,
      university_course_id: universityCourseId,
      semester,
      semester_start_date: semesterStartDate,
      semester_end_date: semesterEndDate,
      description,
      img_uri: imgUri,
    }),
    method: "PUT",
  });

exports.clone = (
  id: number,
  name: string,
  university: string,
  universityCourseId: string,
  semester: string,
  semesterStartDate: string,
  semesterEndDate: string,
  courseAdminId: string,
  description: string,
  imgUri: string
) =>
  request({
    url: `${producer.base_url}/api/courses`,
    body: JSON.stringify({
      id,
      name,
      university,
      university_course_id: universityCourseId,
      semester,
      semester_start_date: semesterStartDate,
      semester_end_date: semesterEndDate,
      course_admin_id: courseAdminId,
      description,
      img_uri: imgUri,
    }),
    method: "POST",
  });

exports.get = (courseId: number): Promise<Course> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}`,
    method: "GET",
  });

exports.getAll = (): Promise<Array<Course>> =>
  request({
    url: `${producer.base_url}/api/courses`,
    method: "GET",
  });

exports.getAllByUser = (userId: number): Promise<Array<Course>> =>
  request({
    url: `${producer.base_url}/api/users/${userId}/courses`,
    method: "GET",
  }).then(courses => courses.map(course => _.extend(course, { enrolled: true })));

exports.getPermissions = (courseId: number): Promise<Array<String>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/permissions`,
    method: "GET",
  });

exports.enroll = (courseId: number) =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/enroll`,
    method: "POST",
  });

exports.unenroll = (courseId: number) =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/unenroll`,
    method: "POST",
  });

exports.getAllStudentsByCourseId = (courseId: number): Promise<Array<Student>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/users?roleName=student`,
    method: "GET",
  });

exports.getAllStudentsAndTeachersByCourseId = (courseId: number): Promise<Array<Student>> =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/users`,
    method: "GET",
  });

const patchCourseUser = (courseId: Number, userId: number, courseUserDetails: any) =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/users/${userId}`,
    body: JSON.stringify(courseUserDetails),
    method: "PATCH",
  });

exports.acceptStudent = (courseId: number, userId: number) =>
  patchCourseUser(courseId, userId, {
    accepted: true,
  });

exports.changeStudentRole = (courseId: number, userId: number, roleName: string) =>
  patchCourseUser(courseId, userId, {
    role: roleName,
  });

exports.deleteStudent = (courseId: Number, userId: number) =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/users/${userId}`,
    method: "DELETE",
  });

exports.getScoreboard = (courseId: Number) =>
  request({
    url: `${producer.base_url}/api/courses/${courseId}/scoreboard`,
    method: "GET",
  });
