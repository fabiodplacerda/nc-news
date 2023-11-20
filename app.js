const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');

//Error Handlers
const { handleServerErrors } = require('./erros');

const app = express();

//Endpoints
app.get('/api/topics', getTopics);

app.use(handleServerErrors);

module.exports = app;
