const { selectUsers, selectUserByUsername } = require('../Models/users-model');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username).then(user => {
    res.status(200).send({ user });
  });
};
