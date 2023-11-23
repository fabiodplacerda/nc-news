const db = require('../db/connection');

exports.selectArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
  const validTopics = ['mitch', 'cats', 'paper'];

  const validSortBy = [
    'article_id',
    'author',
    'title',
    'topic',
    'created_at',
    'votes',
    ,
  ];
  const validOrder = ['ASC', 'DESC'];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  }

  let queryString = `
  SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.article_id) AS comment_count
  FROM articles AS a
  LEFT JOIN comments AS c
  ON a.article_id = c.article_id `;

  const queryStringGroup = `
  GROUP BY  a.article_id
  ORDER BY ${sort_by} ${order}`;

  if (topic) {
    if (!validTopics.includes(topic))
      return Promise.reject({ status: 400, msg: 'Bad request!' });

    queryString += `WHERE topic = '${topic}' `;
    queryString += queryStringGroup;
  } else {
    queryString += queryStringGroup;
  }

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = id => {
  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url , COUNT (c.article_id) AS comment_count 
      FROM articles AS a
      LEFT JOIN comments AS c
      ON a.article_id = c.article_id
      WHERE a.article_id = $1
      GROUP BY a.article_id
      ORDER BY a.created_at DESC;`,
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
