const { selectTopics } = require('../Models/topics-model');

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(next);
};
