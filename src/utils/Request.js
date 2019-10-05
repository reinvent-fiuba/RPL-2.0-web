exports.request = (options) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  
  if(localStorage.getItem('access_token')) {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
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
