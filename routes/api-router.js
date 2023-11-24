const apiRouter = require('express').Router();
const endpointsRouter = require('./endpoints-router');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

apiRouter.get('/', endpointsRouter);

apiRouter.get('/topics', topicsRouter);

apiRouter.route('/articles').get(articlesRouter).post(articlesRouter);

apiRouter
  .route('/articles/:article_id')
  .get(articlesRouter)
  .patch(articlesRouter);

apiRouter
  .route('/articles/:article_id/comments')
  .get(commentsRouter)
  .post(commentsRouter);

apiRouter
  .route('/comments/:comment_id')
  .patch(commentsRouter)
  .delete(commentsRouter);

apiRouter.get('/users', usersRouter);

apiRouter.get('/users/:username', usersRouter);

module.exports = apiRouter;
