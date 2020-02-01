const { getState } = require("./State");

exports.request = options => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const localStorageState = getState();

  const defaults = { headers };
  options = { ...defaults, ...options };

  if (localStorageState.token) {
    options.headers.append(
      "Authorization",
      `${localStorageState.token.tokenType} ${localStorageState.token.accessToken}`
    );
  }

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject({ err: json, status: response.status });
      }
      return json;
    })
  );
};
