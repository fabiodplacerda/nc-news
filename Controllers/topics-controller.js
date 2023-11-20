const { selectTopics } = require('../Models/topics-model');

exports.getTopics = (req, res, next) => {
  selectTopics();
};
