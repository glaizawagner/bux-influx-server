/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const { makesExpensesArray, makeMaliciousExpenses } = require('./fixtures/expenses.fixtures');

describe('Expenses Endpoints', function() {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });
    
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db('expenses').truncate());
    afterEach('cleanup', () => db('expenses').truncate());
  
    describe(`Unauthorized requests`, () => {
    });

    describe(`GET /api/expenses`, () => {
    });

    describe(`GET /api/expenses/:eid`, () => {
    });
   
    describe(`POST /api/expenses`, () => {
    });

    describe(`DELETE /api/expenses/:eid`, () => {
    });

    describe(`PATCH /api/expenses/:eid`, () => {
    });
});