const { request } = require('../utils/Request');

const producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080'
};

exports.getAll = () => {
  return request({
    url: `http://${producer.base_url}/api/courses`,
    method: 'GET'
  }); 
}

exports.getAllByUser = (userId) => {
  return request({
    url: `http://${producer.base_url}/api/users/${userId}/courses`,
    method: 'GET'
  }); 
}
