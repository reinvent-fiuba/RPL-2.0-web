const { getState } = require('./State');

exports.request = (options) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  const localStorageState = getState();

  if (localStorageState.access_token) {
    headers.append('Authorization', `Bearer ${localStorageState.access_token}`);
  }

  const defaults = {headers: headers};
  options = Object.assign({}, defaults, options);

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
