const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require('./Controllers/articles-controller');
const { getEndpoints } = require('./Controllers/api-controller');

//Error Handlers
const {
  handleServerErrors,
  handlePsqError,
  handleCustomsError,
} = require('./errors');

const app = express();
app.use(express.json());

//Endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById);

app.use(handlePsqError);
app.use(handleCustomsError);
app.use(handleServerErrors);

module.exports = app;
