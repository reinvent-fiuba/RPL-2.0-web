// @flow
import type { Activity, Category, IOTest } from "../types";

const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.createActivity = (activityDetails: any) => {
  const formData = new FormData();

  Object.keys(activityDetails).forEach(property => {
    if (!activityDetails[property]) {
      return;
    }
    formData.append(property, activityDetails[property]);
  });

  formData.append("supportingFile", new File(["Hola Mundo!"], "supporting_file1.txt"));
  formData.append("supportingFile", new File(["Hola Mundo2!"], "supporting_file2.txt"));

  return request({
    url: `http://${producer.base_url}/api/courses/${activityDetails.courseId}/activities`,
    body: formData,
    method: "POST",
    headers: new Headers(),
  });
};

exports.updateActivity = (activityDetails: any) => {
  const formData = new FormData();

  Object.keys(activityDetails).forEach(property => {
    if (!activityDetails[property]) {
      return;
    }
    formData.append(property, activityDetails[property]);
  });

  formData.append("supportingFile", new File(["Hola Mundo!"], "supporting_file1.txt"));
  formData.append("supportingFile", new File(["Hola Mundo2!"], "supporting_file2.txt"));

  return request({
    url: `http://${producer.base_url}/api/courses/${activityDetails.courseId}/activities/${activityDetails.activityId}`,
    body: formData,
    method: "PUT",
    headers: new Headers(),
  });
};

exports.getActivityCategories = (courseId: number): Promise<Array<Category>> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activityCategories`,
    method: "GET",
  });

exports.createActivityCategories = (
  courseId: number,
  name: string,
  description: string
): Promise<Category> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activityCategories`,
    method: "POST",
    body: JSON.stringify({ name, description }),
  });

exports.getAllActivities = (courseId: number): Promise<Array<Activity>> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities`,
    method: "GET",
  });

exports.getActivity = (courseId: number, activityId: number): Promise<Activity> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}`,
    method: "GET",
  });

exports.createIOTest = (
  courseId: number,
  activityId: number,
  textIn: string,
  textOut: string
): Promise<IOTest> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/iotests`,
    body: JSON.stringify({ text_in: textIn, text_out: textOut }),
    method: "POST",
  });

exports.updateIOTest = (
  courseId: number,
  activityId: number,
  ioTestId: number,
  textIn: string,
  textOut: string
): Promise<IOTest> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/iotests/${ioTestId}`,
    body: JSON.stringify({ text_in: textIn, text_out: textOut }),
    method: "PUT",
  });

exports.deleteIOTest = (
  courseId: number,
  activityId: number,
  ioTestId: number
): Promise<Activity> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/iotests/${ioTestId}`,
    method: "DELETE",
  });
