const { getState } = require('./State');

exports.request = (options) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  const localStorageState = getState();

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  if (localStorageState.token) {
    options.headers.append('Authorization', `${localStorageState.token.tokenType} ${localStorageState.token.accessToken}`);
  }

  return fetch(options.url, options)
    .then(response => 
      response.json().then(json => {
        if(!response.ok) {
          return Promise.reject(json);
        }
        return json;
    })
  );
};
