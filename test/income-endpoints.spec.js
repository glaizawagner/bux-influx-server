/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const { makesIncomeArray, makeMaliciousIncome } = require('./fixtures/income.fixtures');

describe('Income Endpoints', function() {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });
    

    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db('income').truncate());
    afterEach('cleanup', () => db('income').truncate());
  
    // describe.only(`Unauthorized requests`, () => {
    //     it(`responds with 401 Unauthorized for GET /api/income`, () => {
    //         return supertest(app)
    //         .get('/api/income')
    //         .expect(401, { error: 'Unauthorized request'});
    //     });
    // });

    describe(`GET /api/income`, () => {
    });

    describe(`GET /api/income/:iid`, () => {
    });
   
    describe(`POST /api/income`, () => {
    });

    describe(`DELETE /api/income/:iid`, () => {
    });

    describe(`PATCH /api/income/:iid`, () => {
    });
});