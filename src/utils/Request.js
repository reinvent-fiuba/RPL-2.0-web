const { getState } = require("./State");

function logout() {
  window.localStorage.removeItem("state");
}

exports.request = (options, config) => {
  const { ignoreToken } = config || {};
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const localStorageState = getState();

  const defaults = { headers };
  options = { ...defaults, ...options };

  if (!ignoreToken && localStorageState.token) {
    options.headers.append(
      "Authorization",
      `${localStorageState.token.tokenType} ${localStorageState.token.accessToken}`
    );
  }

  return fetch(options.url, options).then(response => {
    if (response.status === 204) {
      return Promise.resolve();
    }
    return response.json().then(json => {
      if (!response.ok) {
        if (response.status === 401 && json && json.error !== "email_not_validated_error") {
          logout();
          window.location.assign(window.location); // then PrivateRoute will redirect you to the login page
          return Promise.reject();
        }

        return Promise.reject({ err: json, status: response.status });
      }
      return json;
    });
  });
};
