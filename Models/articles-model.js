const db = require('../db/connection');

exports.selectArticles = (
  topic,
  sort_by = 'created_at',
  order = 'DESC',
  limit = 10,
  p = 1
) => {
  const validSortBy = [
    'article_id',
    'author',
    'title',
    'topic',
    'created_at',
    'votes',
  ];
  const validOrder = ['ASC', 'DESC'];
  const offset = limit * p - limit;

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  }
  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: 'Bad request!' });
  }

  return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
    let queryString = `
    SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.article_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c
    ON a.article_id = c.article_id `;

    const queryStringGroup = `
    GROUP BY  a.article_id
    ORDER BY ${sort_by} ${order}
    LIMIT $1 OFFSET $2`;

    if (topic) {
      const validTopics = rows.some(topicObject => {
        return topicObject.slug === topic;
      });
      if (!validTopics) {
        return Promise.reject({ status: 400, msg: 'Bad request!' });
      }
      queryString += `WHERE topic = $3 `;
      queryString += queryStringGroup;
    } else {
      queryString += queryStringGroup;
    }
    return db
      .query(queryString, topic ? [limit, offset, topic] : [limit, offset])
      .then(({ rows }) => {
        return rows;
      });
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

exports.insertArticle = article => {
  const { author, title, body, topic } = article;

  if (!article.article_img_url)
    article.article_img_url =
      'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700';

  const newArticle = db
    .query(
      `            INSERT INTO articles
                   (author, title, body, topic, article_img_url)
                   VALUES
                   ($1, $2, $3, $4, $5)
                   RETURNING article_id`,
      [author, title, body, topic, article.article_img_url]
    )
    .then(({ rows }) => {
      return rows[0].article_id;
    });

  return Promise.all([newArticle])
    .then(([insertedArticleId]) => {
      const queryString = `
    SELECT
      a.author,
      a.title,
      a.article_id,
      a.body,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.article_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id`;

      return db.query(queryString, [insertedArticleId]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
