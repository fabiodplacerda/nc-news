const usersRouter = require('express').Router();
const { getUsers } = require('../Controllers/users-controller');

usersRouter.get('/users', getUsers);

module.exports = usersRouter;
