const { request } = require('../utils/Request');

const producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080'
};

exports.login = (credentials) => {
  return request({
    url: `http://${producer.base_url}/api/auth/login`,
    body: JSON.stringify(credentials),
    method: 'POST'
  }); 
}
    

exports.signup = (user) => {
  return request({
    url: `http://${producer.base_url}/api/auth/signup`,
    body: JSON.stringify(user),
    method: 'POST'
  }); 
}

exports.getProfile = () => {
  return request({
    url: `http://${producer.base_url}/api/auth/profile`,
    method: 'GET'
  });
}
