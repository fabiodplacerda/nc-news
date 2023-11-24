const commentsRouter = require('express').Router();

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  patchCommentById,
} = require('../Controllers/comments-controller');

commentsRouter
  .route('/articles/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

commentsRouter
  .route('/comments/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
