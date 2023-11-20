const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
const endpointsObject = require('../endpoints.json');

beforeEach(() => {
  return seed(data);
});

describe('/api/topics', () => {
  test('GET 200: sends an array of topics to the client ', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        body.forEach(topic => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('/api', () => {
  test('GET 200: responds with an object describing all the available endpoints on the API', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toMatchObject(endpointsObject);
      });
  });
});
