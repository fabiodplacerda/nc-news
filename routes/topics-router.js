const topicsRouter = require('express').Router();
const { getTopics } = require('../Controllers/topics-controller');

topicsRouter.get('/topics', getTopics);

module.exports = topicsRouter;
