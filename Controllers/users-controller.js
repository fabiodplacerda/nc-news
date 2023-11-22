const { selectUsers } = require('../Models/users-model');

exports.getUsers = (req, res, next) => {
  selectUsers().then();
};
