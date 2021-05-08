const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('Testing Questions Endpoints', () => {
  it('Should be able to GET /qa/questions endpoint, given a product_id', async done => {
    const response = await request.get('/qa/questions/?product_id=1');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(Object.keys(response.body)).toContain('product_id');
    expect(Object.keys(response.body)).toContain('results');
    done();
  });

  it('Should return empty results when given a nonexistent product id', async done => {
    const response = await request.get('/qa/questions/?product_id=-1');
    expect(response.body.results.length).toBe(0);
    done();
  });

  it('Should fail when not given a product id', async done => {
    const response = await request.get('/qa/questions');
    expect(response.status).toBe(500);
    done();
  });

  it('Should return the correct amount of questions based on count', async done => {
    const response = await request.get('/qa/questions/?product_id=1&count=1');
    expect(response.body.results.length).toBe(1);
    done();
  });

});

describe('Testing Answers Endpoints', () => {
  it('Should return answers given a question Id', async done => {
    const response = await request.get('/qa/questions/99/answers');
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.status).toBe(200);
    done();
  });
  it('Should require a question_id in params', async done => {
    const response = await request.get('/qa/questions//answers');
    expect(response.status).toBe(404);
    done();
  });
  it('Should respond with requested number of results or fewer', async done => {
    const response = await request.get('/qa/questions/99/answers/?count=2');
    expect(response.body.results.length).toBeLessThanOrEqual(2);
    done();
  });

});

describe('Testing Questions POST Endpoints', () => {
  it('Should post question containing all pertinent fields', async done => {
    const response = await request.post('/qa/questions')
    .send({
      'name': 'jimmy',
      'body': 'quarstchun',
      'email': 'jim@jam.jum',
      'product_id': 99
    });
    expect(response.status).toBe(201);
    const questionGet = await request.get('/qa/questions/?product_id=99&count=1000');
    expect(questionGet.body.results[questionGet.body.results.length - 1].asker_name).toBe('jimmy');
    done();
  });
  it('Should fail on question post lacking any fields', async done => {
    const response = await request.post('/qa/questions')
    .send({
      'name': 'jummmm',
      'email': 'jim@jam.jum',
      'body': 'i failed a question'
    });
    expect(response.status).toBe(500);
    done();
  });
});