const { request } = require('../utils/Request');

const producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080',
};

exports.create = (activityDetails) => {
  const formData = new FormData();

  Object.keys(activityDetails).forEach((property) => {
    if (!activityDetails[property]) {
      return;
    }
    formData.append(property, activityDetails[property]);
  });

  formData.set('supportingFile', new Blob([activityDetails.supportingFile]));

  return request({
    url: `http://${producer.base_url}/api/courses/${activityDetails.courseId}/activities`,
    body: formData,
    method: 'POST',
    headers: new Headers(),
  });
};

exports.getActivityCategories = (courseId) => request({
  url: `http://${producer.base_url}/api/courses/${courseId}/activityCategories`,
  method: 'GET',
});


exports.getAllActivities = (courseId) => request({
  url: `http://${producer.base_url}/api/courses/${courseId}/activities`,
  method: 'GET',
});
