const producer = {
    base_url: process.env.API_BASE_URL || 'localhost:8080'
  };
  
exports.submit =  (submission) => {
  console.log(submission);
  console.log(process.env.API_BASE_URL);
  return fetch(`http://${producer.base_url}/api/health`, {
    method: 'GET'
  }); 
}
