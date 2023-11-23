const articlesRouter = require('express').Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require('../Controllers/articles-controller');

articlesRouter.get('/articles', getArticles);

articlesRouter
  .route('/articles/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
