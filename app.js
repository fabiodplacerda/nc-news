const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const cors = require('cors');

app.use(express.json());
app.use(cors());

//Error Handlers
const {
  handleServerErrors,
  handlePsqError,
  handleCustomsError,
} = require('./errors');

//Endpoints
app.use('/api', apiRouter);

app.use('/api/topics', apiRouter);

app.use('/api/articles', apiRouter);

app.use('/api/articles/:article_id', apiRouter);

app.use('/api/articles/:article_id/comments', apiRouter);

app.use('/api/comments/:comment_id', apiRouter);

app.use('/api/users', apiRouter);

app.use(handlePsqError);
app.use(handleCustomsError);
app.use(handleServerErrors);

module.exports = app;
