const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');
const { getArticleById } = require('./Controllers/articles-controller');

//Error Handlers
const {
  handleServerErrors,
  handlePsqError,
  handleCustomsError,
} = require('./errors');
const { handleServerErrors } = require('./errors');
const { getEndpoints } = require('./Controllers/api-controller');

const app = express();

//Endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use(handlePsqError);
app.use(handleCustomsError);
app.use(handleServerErrors);

module.exports = app;
