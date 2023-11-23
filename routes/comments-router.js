const commentsRouter = require('express').Router();

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require('../Controllers/comments-controller');

commentsRouter
  .route('/articles/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

commentsRouter.delete('/comments/:comment_id', deleteCommentById);

module.exports = commentsRouter;
