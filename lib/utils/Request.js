"use strict";

var _require = require('./State'),
    getState = _require.getState;

exports.request = function (options) {
  var headers = new Headers({
    'Content-Type': 'application/json'
  });
  var localStorageState = getState();
  var defaults = {
    headers: headers
  };
  options = Object.assign({}, defaults, options);

  if (localStorageState.token) {
    options.headers.append('Authorization', "".concat(localStorageState.token.tokenType, " ").concat(localStorageState.token.accessToken));
  }

  return fetch(options.url, options).then(function (response) {
    return response.json().then(function (json) {
      if (!response.ok) {
        return Promise.reject(json);
      }

      return json;
    });
  });
};