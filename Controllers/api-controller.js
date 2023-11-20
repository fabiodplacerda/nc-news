const { showEndpoints } = require('../Models/api-model');

exports.getEndpoints = (req, res, next) => {
  showEndpoints().then(endpoints => {
    res.status(200).send({ endpoints: endpoints });
  });
};
