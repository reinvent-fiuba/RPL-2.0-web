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

exports.createActivity = ({
  courseId,
  name,
  points,
  language,
  categoryId,
  code,
  description,
  active,
  compilationFlags,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("points", points);
  formData.append("language", language);
  formData.append("activityCategoryId", `${categoryId}`);
  formData.append("description", description);
  // Optional arguments
  if (compilationFlags !== undefined) formData.append("compilationFlags", compilationFlags);
  if (active !== undefined) formData.append("active", active);

  Object.keys(code).forEach(fileName => {
    formData.append("startingFile", new File([code[fileName]], fileName));
  });

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities`,
    body: formData,
    method: "POST",
    headers: new Headers(),
  });
};

exports.updateActivity = ({
  courseId,
  activityId,
  name,
  points,
  language,
  categoryId,
  code,
  description,
  active,
  compilationFlags,
}) => {
  const formData = new FormData();
  if (name !== undefined) formData.append("name", name);
  if (points !== undefined) formData.append("points", points);
  if (language !== undefined) formData.append("language", language);
  if (categoryId !== undefined) formData.append("activityCategoryId", `${categoryId}`);
  if (description !== undefined) formData.append("description", description);
  if (compilationFlags !== undefined) formData.append("compilationFlags", compilationFlags);
  if (active !== undefined) formData.append("active", active);

  if (code) {
    Object.keys(code).forEach(fileName => {
      formData.append("startingFile", new File([code[fileName]], fileName));
    });
  }

  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}`,
    body: formData,
    method: "PATCH",
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
): Promise<Activity> => this.updateActivity({ courseId, activityId, active: newStatus });
