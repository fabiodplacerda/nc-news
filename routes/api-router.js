const apiRouter = require('express').Router();
const endpointsRouter = require('./endpoints-router');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

apiRouter.get('/', endpointsRouter);

apiRouter.get('/topics', topicsRouter);

apiRouter.get('/articles', articlesRouter);

apiRouter.get('/articles/:article_id', articlesRouter);

apiRouter.patch('/articles/:article_id', articlesRouter);

apiRouter.get('/articles/:article_id/comments', commentsRouter);

apiRouter.post('/articles/:article_id/comments', commentsRouter);

apiRouter.patch('/comments/:comment_id', commentsRouter);

apiRouter.delete('/comments/:comment_id', commentsRouter);

apiRouter.get('/users', usersRouter);

apiRouter.get('/users/:username', usersRouter);

module.exports = apiRouter;
