/* eslint-disable quotes */
const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containing "A GET request"', () => {
    return supertest(app)
      .get('/')
      .expect(200, `Hello, world!`);
  });
});