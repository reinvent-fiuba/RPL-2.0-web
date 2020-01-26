// @flow
const { request } = require("../utils/Request");
const { tmp } = require("tmp");

const producer = {
  base_url: process.env.API_BASE_URL || "localhost:8080"
};

exports.createSubmission = (
  courseId: number,
  activityId: number,
  code: string
) => {
  const formData = new FormData();

  tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
    if (err) throw err;

    console.log("Dir: ", path);
    

    // Manual cleanup
    cleanupCallback();
  });

  formData.set("file", new Blob([code]));

  // return request({
  //   url: `http://${producer.base_url}/api/courses/${courseId}/activities/${activityId}/submissions`,
  //   body: formData,
  //   method: "POST",
  //   headers: new Headers()
  // });
};
