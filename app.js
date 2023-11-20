const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');

//Error Handlers
const { handleServerErrors } = require('./errors');
const { getEndpoints } = require('./Controllers/api-controller');

const app = express();

//Endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.use(handleServerErrors);

module.exports = app;
