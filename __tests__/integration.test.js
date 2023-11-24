const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
const endpointsObject = require('../endpoints.json');

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe('GET /api', () => {
  test('200: responds with an object describing all the available endpoints on the API', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toMatchObject(endpointsObject);
      });
  });
});

describe('GET /api/topics', () => {
  test('200: sends an array of topics to the client ', () => {
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

describe('GET /api/users', () => {
  test('200: sends an array of users to the client  ', () => {
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

describe('GET /api/users/:username', () => {
  test('200: responds with an object containing one username', () => {
    return request(app)
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: 'rogersop',
          name: 'paul',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        });
      });
  });
  test('404: should respond with an error message when user is non-existing', () => {
    return request(app)
      .get('/api/users/banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found!');
      });
  });
});

describe('GET /api/articles', () => {
  test('200: sends an array of articles to the client ', () => {
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
  test('200: sends an array of articles to the client from the queried topic', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
        articles.forEach(article => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: 'cats',
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test('200: when the topic has no associated articles sends back an empty array', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
        expect(articles).toEqual([]);
      });
  });
  test('200: The endpoint should also accept the following queries: sorty_by', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('votes', { descending: true });
      });
  });
  test('200: The endpoint should also accept the following queries: sorty_by and order ', () => {
    return request(app)
      .get('/api/articles?sort_by=votes&order=ASC')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('votes');
      });
  });
  test('400: responds with an error message when articles are queried with non-existing or invalid query', () => {
    return request(app)
      .get('/api/articles?topic=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('400: responds with an error message when articles are sorted with non-existing or invalid query', () => {
    return request(app)
      .get('/api/articles?sort_by=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('400: responds with an error message when articles are ordered with an invalid query', () => {
    return request(app)
      .get('/api/articles?order=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('200: sends a single article to the client ', () => {
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
  test('200: after update the endpoint should also send the article with the property comment_count', () => {
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
          comment_count: '11',
        });
      });
  });
  test('400: responds with an appropriate status and error message when provided with a bad article id', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("404: responds with an error the article doesn't exist", () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found!');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: should update the article and respond back with the updated article', () => {
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
  test('200: when request body is inserted with unnecessary properties they are ignored', () => {
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
  test('400: responds with an appropriate status and error message when provided with a bad votes value', () => {
    const votes = { inc_votes: 'banana' };
    return request(app)
      .patch('/api/articles/1')
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("404: responds with an error  when the article doesn't exist", () => {
    const votes = { inc_votes: 200 };
    return request(app)
      .patch('/api/articles/999')
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found!');
      });
  });
  test('400: responds with an error when trying to update a bad article_id', () => {
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

describe('GET /api/articles/:article_id/comments', () => {
  test('200: responds with an array of comments for the given article_id', () => {
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
  test('200: responds with an array empty array if article_id exists but has no comments', () => {
    return request(app)
      .get('/api/articles/7/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test('400: responds with an appropriate status and error message when provided with a bad article id', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("404: responds with an error the article doesn't exist", () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found!');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: inserts a comment to the db and sends the new comment back to the client', () => {
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
  test('201: when a comment is inserted with unnecessary properties they are ignored', () => {
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
  test('400: responds with an appropriate status and error message when posting without a body property', () => {
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
  test('400: responds with an appropriate status and error message when posting with a non-existing user', () => {
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
  test('400: responds with an appropriate status and error message when posting with in non-existing article', () => {
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
  test('400: responds with an appropriate status and error message when posting with a bad article_id', () => {
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

describe('PATCH /api/comments/:comment_id', () => {
  test("200: update the votes on a comment given the comment's comment_id.", () => {
    const newVotes = { inc_votes: 4 };
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.votes).toBe(20);
      });
  });
  test('200: when request body is inserted with unnecessary properties they are ignored', () => {
    const newVotes = {
      inc_votes: 4,
      author: 'newUser',
      comment_id: 27,
      body: 'hello?',
    };
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: 'butter_bridge',
          votes: 20,
          created_at: '2020-04-06T12:17:00.000Z',
        });
      });
  });
  test('404: sends an error message when trying to updated a comment with a non existing comment_id', () => {
    const newVotes = { inc_votes: 4 };
    return request(app)
      .patch('/api/comments/999')
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('comment not found!');
      });
  });
  test('400: sends an error message when trying to updated a comment with a invalid comment_id', () => {
    const newVotes = { inc_votes: 4 };
    return request(app)
      .patch('/api/comments/banana')
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test('400: sends an error message when provided with a invalid votes value ', () => {
    const newVotes = { inc_votes: 'banana' };
    return request(app)
      .patch('/api/comments/1')
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: it should delete a comment accordingly with its id', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
  test('400: responds with an appropriate error message when given an invalid id', () => {
    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request!');
      });
  });
  test("404: responds with an appropriate error message when the id doesn't exist", () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('comment not found!');
      });
  });
});
