const db = require('../db/connection');

exports.selectCommentsByArticleId = id => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY created_at ASC`,
      [id]
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
