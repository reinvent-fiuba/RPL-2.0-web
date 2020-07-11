// @flow
const { request } = require("../utils/Request");

const cloudinary = {
  url: process.env.CLOUDINARY_URL,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
};

exports.uploadFile = (file: file): Promise<Any> => {
  if (!file) return Promise.resolve();
  console.log(cloudinary);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinary.upload_preset);
  const headers = new Headers();
  headers.append("X-Requested-With", "XMLHttpRequest");
  return request(
    {
      url: cloudinary.url,
      body: formData,
      method: "POST",
      headers,
    },
    {
      ignoreToken: true,
    }
  );
};
