const { selectArticleById } = require('../Models/articles-model');
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require('../Models/comments-model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then(comments => {
      res.status(200).send({ comments: comments[0] });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  insertCommentByArticleId(article_id, newComment)
    .then(comment => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
