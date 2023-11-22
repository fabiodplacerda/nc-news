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

describe('/api/articles', () => {
  test('GET 200: sends an array of articles to the client ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
        articles.forEach(article => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
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
        expect(body.msg).toBe('Article not found!');
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
  //PATCH
  test('PATCH 200: should update the article and respond back with the updated article', () => {
    const votes = { inc_votes: -100 };
    return request(app)
      .patch('/api/articles/1')
      .send(votes)
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
          votes: 0,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('PATCH 200: when request body is inserted with unnecessary properties they are ignored', () => {
    const votes = { inc_votes: -100, body: 'hello!', url: 'wwww.google.com' };
    return request(app)
      .patch('/api/articles/1')
      .send(votes)
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
          votes: 0,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('PATCH 400: responds with an appropriate status and error message when provided with a bad votes value', () => {
    const votes = { inc_votes: 'banana' };
    return request(app)
      .patch('/api/articles/1')
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("PATCH 404: responds with an error  when the article doesn't exist", () => {
    const votes = { inc_votes: 200 };
    return request(app)
      .patch('/api/articles/999')
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found!');
      });
  });
  test('PATCH 400: responds with an error when trying to update a bad article_id', () => {
    const votes = { inc_votes: 200 };
    return request(app)
      .patch('/api/articles/banana')
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
});

describe('/api/articles', () => {
  test('GET 200: sends an array of articles to the client ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
        articles.forEach(article => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe('/api/articles/:article_id/comments', () => {
  test('GET 200: responds with an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy('created_at');
        comments.forEach(comment => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test('GET 200: responds with an array empty array if article_id exists but has no comments', () => {
    return request(app)
      .get('/api/articles/7/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test('GET 400:  responds with an appropriate status and error message when provided with a bad article id', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("GET 404: responds with an error the article doesn't exist", () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found!');
      });
  });

  //POST
  test('POST 201: inserts a comment to the db and sends the new comment back to the client', () => {
    const newComment = {
      username: 'lurker',
      body: 'I have nothing to say',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe('lurker');
        expect(comment.body).toBe('I have nothing to say');
      });
  });
  test('POST 201: when a comment is inserted with unnecessary properties they are ignored', () => {
    const newComment = {
      username: 'lurker',
      body: 'I have nothing to say',
      comment_id: 12,
      likes: 24,
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: 'I have nothing to say',
          article_id: 1,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('POST 400: responds with an appropriate status and error message when posting without a body property', () => {
    const newComment = {
      username: 'lurker',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('POST 400: responds with an appropriate status and error message when posting with a non-existing user', () => {
    const newComment = {
      username: 'NewUser5050',
      body: 'I have nothing to say',
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('POST 400: responds with an appropriate status and error message when posting with in non-existing article', () => {
    const newComment = {
      username: 'NewUser5050',
      body: 'I have nothing to say',
    };
    return request(app)
      .post('/api/articles/999/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('POST 400: responds with an appropriate status and error message when posting with a bad article_id', () => {
    const newComment = {
      username: 'NewUser5050',
      body: 'I have nothing to say',
    };
    return request(app)
      .post('/api/articles/banana/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
});

describe('/api/users', () => {
  test('GET 200: sends an array of users to the client  ', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach(user => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
