const express = require('express');

// Controllers
const { getTopics } = require('./Controllers/topics-controller');
const {
  getArticleById,
  getArticles,
} = require('./Controllers/articles-controller');
const { getEndpoints } = require('./Controllers/api-controller');
const { getCommentsByArticleId } = require('./Controllers/comments-controller');

//Error Handlers
const {
  handleServerErrors,
  handlePsqError,
  handleCustomsError,
} = require('./errors');

const app = express();

//Endpoints
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.use('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use(handlePsqError);
app.use(handleCustomsError);
app.use(handleServerErrors);

module.exports = app;
