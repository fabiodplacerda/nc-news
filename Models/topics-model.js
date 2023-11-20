const db = require('../db/connection');

exports.selectTopics = () => {
  db.query(`SELECT * FROM topics`);
};
