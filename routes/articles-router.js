const articlesRouter = require('express').Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
} = require('../Controllers/articles-controller');

articlesRouter.route('/articles').get(getArticles).post(postArticle);

articlesRouter
  .route('/articles/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
