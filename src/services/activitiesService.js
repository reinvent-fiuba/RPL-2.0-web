const { request } = require('../utils/Request');

const producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080'
};

exports.create = (activityDetails) => {
  const formData  = new FormData();

  activityDetails.supportingFile = new Blob([activityDetails.supportingFile]);

  for(const name in activityDetails) {
    formData.append(name, activityDetails[name]);
  }

  return request({
    url: `http://${producer.base_url}/api/courses/${activityDetails.courseId}/activities`,
    body: formData,
    method: 'POST',
    headers: new Headers()
  });
}

exports.getActivityCategories = (courseId) => {
  return request({
    url: `http://${producer.base_url}/api/courses/${courseId}/activityCategories`,
    method: 'GET'
  }); 
}
