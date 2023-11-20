// const endpoints = require('../endpoints.json');
const fs = require('fs/promises');

exports.showEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then(data => {
    return JSON.parse(data);
  });
};
