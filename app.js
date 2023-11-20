const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');

//Error Handlers
const {
  handlePsqErrors,
  handleCustomErrors,
  handleServerErrors,
} = require('./erros');

const app = express();
app.use(express.json());

//Endpoints
app.get('/api/topics', getTopics);

app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
