"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("./State"),
    getState = _require.getState;

exports.request = function (options) {
  var headers = new Headers({
    "Content-Type": "application/json"
  });
  var localStorageState = getState();
  var defaults = {
    headers: headers
  };
  options = _objectSpread({}, defaults, {}, options);

  if (localStorageState.token) {
    options.headers.append("Authorization", "".concat(localStorageState.token.tokenType, " ").concat(localStorageState.token.accessToken));
  }

  return fetch(options.url, options).then(function (response) {
    return response.json().then(function (json) {
      if (!response.ok) {
        return Promise.reject(json, response);
      }

      return json;
    });
  });
};