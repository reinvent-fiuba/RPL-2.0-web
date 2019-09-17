const producer = {
    host: process.env.PRODUCER_SERVICE_HOST || 'localhost',
    port: process.env.PRODUCER_SERVICE_PORT || 8080
  };
  
exports.submit =  (submission) => {
  console.log(submission);
  console.log(process.env.PRODUCER_SERVICE_HOST);
  console.log(process.env.PRODUCER_SERVICE_PORT);
  return fetch(`${producer.host}:${producer.port}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: submission
  }); 
}
