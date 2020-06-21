// @flow
// import { Archive } from "libarchive.js/main";
import type { Activity, Category } from "../types";

const { request } = require("../utils/Request");

// Archive.init({
//   workerUrl: "libarchive.js/dist/worker-bundle.js",
// });

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.createActivity = (
  courseId: number,
  name: string,
  points: string,
  language: string,
  activityCategoryId: number,
  initialCode: { [string]: string },
  description: string
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("points", points);
  formData.append("language", language);
  formData.append("activityCategoryId", `${activityCategoryId}`);
  formData.append("description", description);

  Object.keys(initialCode).forEach(fileName => {
    formData.append("startingFile", new File([initialCode[fileName]], fileName));
  });

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities`,
    body: formData,
    method: "POST",
    headers: new Headers(),
  });
};

exports.updateActivity = (
  courseId: number,
  activityId: number,
  name: string,
  points: string,
  language: string,
  activityCategoryId: number,
  initialCode: { [string]: string },
  description: string
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("points", points);
  formData.append("language", language);
  formData.append("activityCategoryId", `${activityCategoryId}`);
  formData.append("description", description);

  Object.keys(initialCode).forEach(fileName => {
    formData.append("startingFile", new File([initialCode[fileName]], fileName));
  });

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}`,
    body: formData,
    method: "PUT",
    headers: new Headers(),
  });
};

exports.softUpdateActivity = ({
  courseId,
  activityId,
  name,
  points,
  language,
  activityCategoryId,
  initialCode,
  description,
  active,
  compilationFlags,
}) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (points) formData.append("points", points);
  if (language) formData.append("language", language);
  if (activityCategoryId) formData.append("activityCategoryId", `${activityCategoryId}`);
  if (description) formData.append("description", description);
  if (compilationFlags) formData.append("compilationFlags", compilationFlags);
  if (active) formData.append("active", active);

  console.log(initialCode);
  if (initialCode) {
    Object.keys(initialCode).forEach(fileName => {
      formData.append("startingFile", new File([initialCode[fileName]], fileName));
    });
  }

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}`,
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
  }).then(activity => {
    return fetch(`http://localhost:8080/api/getExtractedFile/${activity.file_id}`).then(
      response => {
        return response.json().then(code => {
          const completeActivity = activity;
          completeActivity.initial_code = code;
          return completeActivity;
        });
      }
    );
  });

exports.deleteActivity = (courseId: number, activityId: number): Promise<Activity> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}`,
    method: "DELETE",
  });

exports.disableActivity = (
  courseId: number,
  activityId: number,
  newStatus: boolean
): Promise<Activity> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/disable`,
    body: JSON.stringify({ active: newStatus }),
    method: "PUT",
  });

exports.getStats = (courseId: number): Promise<any> =>
  request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/stats`,
    method: "GET",
  });
