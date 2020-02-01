const { request } = require("../utils/Request");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080",
};

exports.submit = (usernameOrMail, password) =>
  request({
    url: `http://${producer.base_url}/api/health`,
    method: "POST",
    body: JSON.stringify({
      usernameOrMail,
      password,
    }),
  });
