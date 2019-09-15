const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const submissionService = require('./service/submissionService');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.post('/api/submit', (req, res) => {
  console.log('/api/submit');
  submissionService.submit(req.body)
    .then((r) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(r));      
    });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
