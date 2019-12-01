/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function() {
  let db;
  const {
    testUsersInc,
    testIncome,
  } = helpers.makeIncomeFixtures();

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

  beforeEach('insert income', () =>
      helpers.seedIncomeTables(
        db,
        testUsersInc,
        testIncome
      )
  );

  const protectedEndpoints = [
    {
      name: 'GET /api/income',
      path: '/api/income',
      method: supertest(app).get
    },
    {
        name: 'GET /api/income/:iid',
        path: '/api/income/1',
        method: supertest(app).get
    }
  ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => { 
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: `Missing bearer token` });
            });
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsersInc[0];
                const invalidSecret = 'bad-secret';
                return endpoint.method(endpoint.path)
                .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                .expect(401, { error: `Unauthorized request` });
            });
        });
    });
});