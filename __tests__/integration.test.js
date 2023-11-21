const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
const endpointsObject = require('../endpoints.json');

beforeEach(() => {
  return seed(data);
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

describe('/api/articles/:article_id', () => {
  test('GET 200: sends a single article to the client ', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test("GET 404: responds with an error the article doesn't exist", () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found!');
      });
  });
  test('GET 400: responds with an appropriate status and error message when provided with a bad article id', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
});
