/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const jwt = require('jsonwebtoken')
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
    before('clean the table', () => db.raw('TRUNCATE expenses RESTART IDENTITY CASCADE'));
    afterEach('cleanup', () => db.raw('TRUNCATE expenses RESTART IDENTITY CASCADE'));
  
    // still need to fix coz didn't implement authorization yet
    // describe(`Unauthorized requests`, () => {
    //     it(`responds with 401 Unauthorized for GET /api/expenses`, () => {
    //         return supertest(app)
    //         .get('/api/expenses')
    //         .expect(401, { error: 'Unauthorized request'});
    //     });
    // });

  
    describe(`GET /api/expenses`, () => {
        context(`Given no expenses`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/expenses')
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, []);
            });
        });

        context('Given there are expenses in the database', () => {
            const testExpenses= makesExpensesArray();
            
            beforeEach('insert expenses', () => {
                return db
                .into('expenses')
                .insert(testExpenses);
            });

            it('GET /api/expenses responds with 200 and all of the expenses', () => {
                return supertest(app)
                .get('/api/expenses')
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, testExpenses);
            });
        });

        context(`Given an XSS attack expenses`, () => {
            const { maliciousExpenses, expectedExpenses } = makeMaliciousExpenses();
      
            beforeEach('insert malicious expenses', () => {
              return db
                .into('expenses')
                .insert([ maliciousExpenses ]);
            });
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/api/expenses`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200)
                .expect(res => {
                  expect(res.body[0].description).to.eql(expectedExpenses.description);
                });
            });
        });
    });
  
    describe(`GET /api/expenses/:eid`, () => {
        context(`Given no expenses`, () => {
            it(`responds with 404`, () => {
              const eid = 123;
              return supertest(app)
                .get(`/api/expenses/${eid}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error:  {message: `Expenses doesn't exist`}});
            });
        });

        context('Given there are expenses in the database', () => {
            const testExpenses = makesExpensesArray();
      
            beforeEach('insert expenses', () => {
              return db
                .into('expenses')
                .insert(testExpenses);
            });
      
            it('responds with 200 and the specified expenses', () => {
              const eid = 2;
              const expectedExpenses= testExpenses[eid - 1];
              return supertest(app)
                .get(`/api/expenses/${eid}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, expectedExpenses);
            });
        });

        context(`Given an XSS attack expenses`, () => {
            const { maliciousExpenses, expectedExpenses } = makeMaliciousExpenses();
      
            beforeEach('insert malicious expenses', () => {
              return db
                .into('expenses')
                .insert([ maliciousExpenses ]);
            });
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/api/expenses/${maliciousExpenses.eid}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200)
                .expect(res => {
                  expect(res.body.description).to.eql(expectedExpenses.description);
                });
            });
        });

    });
  
    describe(`POST /api/expenses`, () => {
        it(`creates a new expenses, responding with 201 and the new expenses`, () => {
            this.retries(3);
            const newExpenses= {
              date_created: '2019-11-12T16:28:32.615Z',
              type: 'exp',
              description: 'Salary',
              value: '2000.00',
              percentage: '15.00'
            };
            return supertest(app)
              .post(`/api/expenses`)
              .send(newExpenses)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.date_created).to.eql(newExpenses.date_created);
                expect(res.body.type).to.eql(newExpenses.type);
                expect(res.body.description).to.eql(newExpenses.description);
                expect(res.body.value).to.eql(newExpenses.value);
                expect(res.body.percentage).to.eql(newExpenses.percentage);
                expect(res.body).to.have.property('eid');
                expect(res.headers.location).to.eql(`/api/expenses/${res.body.eid}`);
                // const expected = new Date().toLocaleString('en', { timeZone: 'UTC' });
                // const actual = new Date(res.body.date_created).toLocaleString();
                // expect(actual).to.eql(expected);
              })
              .then(postRes =>
                 supertest(app)
                   .get(`/api/expenses/${postRes.body.eid}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                   .expect(postRes.body)
              );
        });

        const requiredFields = ['description'];

        // requiredFields.forEach(field => {
        //     const newExpenses = {
        //       description: 'Groceries'
        //     };
  
        //       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        //         delete newExpenses[field];
  
        //         return supertest(app)
        //           .post('/api/income')
        //           .send(newExpenses)
        //           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        //           .expect(400, {
        //             error: { message: `'${field}' is required` }
        //           });
        //       });
            
        //       // it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        //       //   delete newExpenses[field];
  
        //       //   return supertest(app)
        //       //     .post('/api/expenses')
        //       //     .send(newExpenses)
        //       //     .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        //       //     .expect(400, {
        //       //       error: { message: `'${field}' is required` }
        //       //     });
        //       // });
        // });

        it('removes XSS attack content from response', () => {
            const { maliciousExpenses, expectedExpenses } = makeMaliciousExpenses();
            return supertest(app)
              .post(`/api/expenses`)
              .send(maliciousExpenses)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(201)
              .expect(res => {
                expect(res.body.description).to.eql(expectedExpenses.description);
              });
        });

    });
    
    describe(`DELETE /api/expenses/:eid`, () => {
        context(`Given no expenses`, () => {
            it(`responds with 400`, () => {
              const eid = 123456;
              return supertest(app)
                .delete(`/api/expenses/${eid}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error: { message: `Expenses doesn't exist` } });
            });
        });

        context('Given there are expenses in the database', () => {
            const testExpenses = makesExpensesArray();
      
            beforeEach('insert expenses', () => {
              return db
                .into('expenses')
                .insert(testExpenses);
            });
      
            it('responds with 204 and removes the expenses', () => {
              const idToRemove = 2;
              const expectedExpenses = testExpenses.filter(exp => exp.eid !== idToRemove);
              return supertest(app)
                .delete(`/api/expenses/${idToRemove}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/expenses`)
                    // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(expectedExpenses)
                );
            });
        });

    });
    
    describe(`PATCH /api/expenses/:eid`, () => {
        context(`Given no expenses`, () => {
            it(`responds with 404`, () => {
              const eid = 123456;
              return supertest(app)
                .delete(`/api/expenses/${eid}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(404, { error: { message: `Expenses doesn't exist` } });
            });
        });

        context('Given there are expenses in the database', () => {
            const testExpenses = makesExpensesArray()
      
            beforeEach('insert expenses', () => {
              return db
                .into('expenses')
                .insert(testExpenses)
            })
      
            it('responds with 204 and updates the expenses', () => {
              const idToUpdate = 2
              const updateExpenses = {
                  date_created: '2019-11-12T16:28:32.615Z',
                  type: 'exp',
                  description: 'Salary',
                  value: '2000.00',
                  percentage: '15.00'
              }
              const expectedExpenses = {
                ...testExpenses[idToUpdate - 1],
                ...updateExpenses
              }
              return supertest(app)
                .patch(`/api/expenses/${idToUpdate}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(updateExpenses)
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/expenses/${idToUpdate}`)
                    // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(expectedExpenses)
                )
            })
    
            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/expenses/${idToUpdate}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain 'description'`
                  }
                })
            })
    
            it(`responds with 204 when updating only a subset of fields`, () => {
              const idToUpdate = 2
              const updateExpenses = {
                description: 'updated expenses description',
              }
              const expectedExpenses = {
                ...testExpenses[idToUpdate - 1],
                ...updateExpenses
              }
    
              return supertest(app)
                .patch(`/api/expenses/${idToUpdate}`)
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({
                  ...updateExpenses,
                  fieldToIgnore: 'should not be in GET response'
                })
                
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/expenses/${idToUpdate}`)
                    // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(expectedExpenses)
                )
            });
        });

    });

});