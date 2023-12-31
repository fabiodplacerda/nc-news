const db = require('../db/connection');

exports.selectCommentsByArticleId = (id, limit = 10, p = 1) => {
  const offset = limit * p - limit;
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at ASC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (id, comment) => {
  const { username, body } = comment;

  const queryString = `INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`;

  return db.query(queryString, [username, body, id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeCommentById = id => {
  const queryString = `DELETE FROM comments
                       WHERE comment_id = $1`;

  return db.query(queryString, [id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'comment not found!' });
    }
  });
};

exports.updateCommentById = (id, votes) => {
  return db
    .query(
      `UPDATE comments
       SET votes = votes + $1
       WHERE comment_id = $2
       RETURNING *;`,
      [votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'comment not found!' });
      }
      return rows[0];
    });
};
