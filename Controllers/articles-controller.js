const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
} = require('../Models/articles-model');

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  selectArticles(topic, sort_by, order, limit, p)
    .then(articles => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

  updateArticleById(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
