const usersRouter = require('express').Router();

const {
  getUsers,
  getUserByUsername,
} = require('../Controllers/users-controller');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:username', getUserByUsername);

module.exports = usersRouter;
