const { selectArticleById } = require('../Models/articles-model');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then(article => {
    res.status(200).send({ article: article });
  });
};
