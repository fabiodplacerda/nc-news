const { getEndpoints } = require('../Controllers/api-controller');
const endpointsRouter = require('express').Router();

endpointsRouter.get('/', getEndpoints);

module.exports = endpointsRouter;
