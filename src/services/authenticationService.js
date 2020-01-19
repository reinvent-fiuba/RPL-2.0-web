const { request } = require('../utils/Request');

const producer = {
  base_url: process.env.API_BASE_URL || 'localhost:8080',
};

exports.login = (credentials) => request({
  url: `http://${producer.base_url}/api/auth/login`,
  body: JSON.stringify(credentials),
  method: 'POST',
});


exports.signup = (user) => request({
  url: `http://${producer.base_url}/api/auth/signup`,
  body: JSON.stringify(user),
  method: 'POST',
});

exports.getProfile = () => request({
  url: `http://${producer.base_url}/api/auth/profile`,
  method: 'GET',
});
