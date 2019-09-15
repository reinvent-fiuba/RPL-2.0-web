const producer = {
    host: process.env.PRODUCER_SERVICE_HOST,
    port: process.env.PRODUCER_SERVICE_PORT
  };
  
exports.submit =  (submission) => {
  console.log(submission);
  return fetch(`${producer.host}:${producer.port}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: submission
  }); 
}
