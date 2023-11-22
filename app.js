const express = require('express');

// Controllers
const { getEndpoints } = require('./Controllers/api-controller');
const { getTopics } = require('./Controllers/topics-controller');
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require('./Controllers/articles-controller');
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('./Controllers/comments-controller');

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

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.use(handlePsqError);
app.use(handleCustomsError);
app.use(handleServerErrors);

module.exports = app;
