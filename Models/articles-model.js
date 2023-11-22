const db = require('../db/connection');

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
      ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = id => {
  return db
    .query(
      `SELECT * FROM articles
     WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Article not found!' });
      }
      return rows[0];
    });
};

exports.updateArticleById = (id, votes) => {
  const { inc_votes } = votes;
  const queryString = `UPDATE articles
                       SET votes = votes + $1
                       WHERE article_id = $2
                       RETURNING *;`;

  return db.query(queryString, [inc_votes, id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: 'Article not found!' });
    }
    return rows[0];
  });
};
