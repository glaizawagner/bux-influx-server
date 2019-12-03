/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Expense Endpoints', function() {
let db;

  const {
    testUsersExp,
    testExpenses,
  } = helpers.makeExpensesFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert expenses', () =>
    helpers.seedExpensesTables(
        db,
        testUsersExp,
        testExpenses
    )
 );

  const protectedEndpoints = [
    {
      name: 'GET /api/expenses',
      path: '/api/expenses',
      method: supertest(app).get
    },
    {
      name: 'GET /api/expenses/:iid',
      path: '/api/expenses/1',
      method: supertest(app).get
    },
    {
      name: 'DELETE /api/expenses/:iid',
      path: '/api/expenses/1',
      method: supertest(app).delete
    },
    {
      name: 'POST /api/expenses',
      path: '/api/expenses',
      method: supertest(app).post
    },
    {
      name: 'GET /api/users/current-user',
      path: '/api/users/current-user',
      method: supertest(app).get
    },
    {
      name: 'DELETE /api/users/current-user',
      path: '/api/users/current-user',
      method: supertest(app).delete
    },
  ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => { 
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: `Missing bearer token` });
            });
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsersExp[0];
                const invalidSecret = 'bad-secret';
                return endpoint.method(endpoint.path)
                .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                .expect(401, { error: `Unauthorized request` });
            });
            it(`responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'bad', id: 1 };
                return endpoint.method(endpoint.path)
                  .set('Authorization', helpers.makeAuthHeader(invalidUser))
                  .expect(401, { error: 'Unauthorized request' });
            });
        });
    });
});