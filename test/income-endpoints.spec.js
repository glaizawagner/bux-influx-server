/* eslint-disable quotes */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Income Endpoints', function() {
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
    before('clean the table', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));
  
//done
    describe(`GET /api/income`, () => {
        // context(`Given no income`, () => {
        //     it(`responds with 200 and an empty list`, () => {
        //       return supertest(app)
        //         .get('/api/income')
        //         .expect(200, []);
        //     });
        // });
      
        context('Given there are income in the database', () => {
          // beforeEach('insert income', () =>
          //   helpers.seedIncomeTables(
          //     db,
          //     testUsersInc,
          //     testIncome, 
          //   )
          // )
  
          // console.log(testUsersInc)
          // console.log(testIncome)
          // it('responds with 200 and all of the income', () => {
          //   const expectedIncome = testIncome.map(inc =>
          //     helpers.makeExpectedIncome(
          //       testUsersInc,
          //       inc,
          //     )
          //   )
          //   return supertest(app)
          //     .get('/api/income')
          //     .expect(200, expectedIncome)
          // })
        });

        context(`Given an XSS attack income`, () => {
        //   const testUserInc = helpers.makeUsersArray()[1]
        //   const {
        //     maliciousIncome,
        //     expectedIncome,
        //   } = helpers.makeMaliciousIncome(testUserInc)
    
        //   beforeEach('insert malicious income', () => {
        //     return helpers.seedMaliciousIncome(
        //       db,
        //       testUserInc,
        //       maliciousIncome,
        //     )
        //   })
    
        //   it('removes XSS attack content', () => {
        //     return supertest(app)
        //       .get(`/api/income`)
        //       .expect(200)
        //       .expect(res => {
        //         expect(res.body[0].description).to.eql(expectedIncome.description)
        //       })
        //   })
        // });
    });
    
    describe(`GET /api/income/:iid`, () => {
        // context(`Given no income`, () => {
        //   beforeEach(() =>
        //     helpers.seedUsers(db, 
        //       testUsersInc
        //       )
        //   )
        //   it(`responds with 404`, () => {
        //       const iid = 123;
        //       return supertest(app)
        //         .get(`/api/income/${iid}`)
        //         .set('Authorization', helpers.makeAuthHeader(testUsersInc[0]))
        //         .expect(404, { error:  {message: `Income doesn't exist`}});
        //   });
        });

        //to fix
        // context('Given there are income in the database', () => {
        //   beforeEach('insert things', () =>
        //     helpers.seedIncomeTables(
        //       db,
        //       testUsersInc,
        //       testIncome,
        //     )
        //   )
        //     it('responds with 200 and the specified income', () => {
        //       const iid = 2;
        //       const expectedIncome= helpers.makeExpectedIncome(
        //         testUsersInc,
        //         testIncome[iid - 1],
        //       )
        //       return supertest(app)
        //         .get(`/api/income/${iid}`)
        //         .set('Authorization', helpers.makeAuthHeader(testUsersInc[0]))
        //         .expect(200, expectedIncome);
        //     });
        // });

        // context(`Given an XSS attack income`, () => {
        //     const testUserInc = helpers.makeUsersArray()[1]
        //     const {
        //       maliciousIncome,
        //       expectedIncome,
        //     } = helpers.makeMaliciousIncome(testUserInc)
      
        //     beforeEach('insert malicious income', () => {
        //       return helpers.seedMaliciousIncome(
        //         db,
        //         testUserInc,
        //         maliciousIncome,
        //       )
        //     });
      
        //     it('removes XSS attack content', () => {
        //       return supertest(app)
        //         .get(`/api/income/${maliciousIncome.iid}`)
        //         .set('Authorization', helpers.makeAuthHeader(testUserInc))
        //         .expect(200)
        //         .expect(res => {
        //           expect(res.body.description).to.eql(expectedIncome.description);
        //         });
        //     });
        // });

    });
   
    // describe(`POST /api/income`, () => {
    //     it(`creates a new income, responding with 201 and the new income`, () => {
    //         this.retries(3);
    //         const newIncome= {
    //           date_created: '2019-11-12T16:28:32.615Z',
    //           type: 'inc',
    //           description: 'Salary',
    //           value: '2000.00',
    //         };
    //         return supertest(app)
    //           .post(`/api/income`)
    //           .send(newIncome)
    //         //   .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //           .expect(201)
    //           .expect(res => {
    //             expect(res.body.date_created).to.eql(newIncome.date_created);
    //             expect(res.body.type).to.eql(newIncome.type);
    //             expect(res.body.description).to.eql(newIncome.description);
    //             expect(res.body.value).to.eql(newIncome.value);
    //             expect(res.body).to.have.property('iid');
    //             expect(res.headers.location).to.eql(`/api/income/${res.body.iid}`);
    //             // const expected = new Date().toLocaleString('en', { timeZone: 'UTC' });
    //             // const actual = new Date(res.body.date_created).toLocaleString();
    //             // expect(actual).to.eql(expected);
    //           })
    //           .then(postRes =>
    //              supertest(app)
    //                .get(`/api/income/${postRes.body.iid}`)
    //             //    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //                .expect(postRes.body)
    //           );
    //     });

    //     const requiredFields = ['description'];

    //     requiredFields.forEach(field => {
    //       const newIncome = {
    //         description: 'Salary'
    //       };

    //       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
    //           delete newIncome[field];

    //           return supertest(app)
    //             .post('/api/income')
    //             .send(newIncome)
    //             // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //             .expect(400, {
    //               error: { message: `'${field}' is required` }
    //             });
    //       });
    //     });

    //     it('removes XSS attack content from response', () => {
    //       const { maliciousIncome, expectedIncome } = makeMaliciousIncome();
    //       return supertest(app)
    //         .post(`/api/income`)
    //         .send(maliciousIncome)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .expect(201)
    //         .expect(res => {
    //           expect(res.body.description).to.eql(expectedIncome.description);
    //         });
    //     });

    // });

    
    // describe(`DELETE /api/income/:iid`, () => {
    //   context(`Given no income`, () => {
    //     it(`responds with 400`, () => {
    //       const iid = 123456;
    //       return supertest(app)
    //         .delete(`/api/income/${iid}`)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .expect(404, { error: { message: `Income doesn't exist` } })
    //     });
    //   });

    //   context('Given there are income in the database', () => {
    //     const testIncome = makesIncomeArray();
  
    //     beforeEach('insert income', () => {
    //       return db
    //         .into('income')
    //         .insert(testIncome);
    //     });
  
    //     it('responds with 204 and removes the income', () => {
    //       const idToRemove = 2;
    //       const expectedIncome = testIncome.filter(inc => inc.iid !== idToRemove);
    //       return supertest(app)
    //         .delete(`/api/income/${idToRemove}`)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/income`)
    //             // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //             .expect(expectedIncome)
    //         );
    //     });
    //   });

    // });

    
    // describe(`PATCH /api/income/:iid`, () => {
    //   context(`Given no income`, () => {
    //     it(`responds with 404`, () => {
    //       const iid = 123456;
    //       return supertest(app)
    //         .delete(`/api/income/${iid}`)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .expect(404, { error: { message: `Income doesn't exist` } });
    //     });
    //   });

    //   context('Given there are income in the database', () => {
    //     const testIncome = makesIncomeArray()
  
    //     beforeEach('insert income', () => {
    //       return db
    //         .into('income')
    //         .insert(testIncome)
    //     })
  
    //     it('responds with 204 and updates the income', () => {
    //       const idToUpdate = 2
    //       const updateIncome = {
    //           date_created: '2019-11-12T16:28:32.615Z',
    //           type: 'inc',
    //           description: 'Salary',
    //           value: '2000.00',
    //       }
    //       const expectedIncome = {
    //         ...testIncome[idToUpdate - 1],
    //         ...updateIncome
    //       }
    //       return supertest(app)
    //         .patch(`/api/income/${idToUpdate}`)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .send(updateIncome)
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/income/${idToUpdate}`)
    //             // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //             .expect(expectedIncome)
    //         )
    //     })

    //     it(`responds with 400 when no required fields supplied`, () => {
    //       const idToUpdate = 2
    //       return supertest(app)
    //         .patch(`/api/income/${idToUpdate}`)
    //         .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .send({ irrelevantField: 'foo' })
    //         .expect(400, {
    //           error: {
    //             message: `Request body must contain 'description'`
    //           }
    //         })
    //     })

    //     it(`responds with 204 when updating only a subset of fields`, () => {
    //       const idToUpdate = 2
    //       const updateIncome = {
    //         description: 'updated income description',

    //       }
    //       const expectedIncome = {
    //         ...testIncome[idToUpdate - 1],
    //         ...updateIncome
    //       }

    //       return supertest(app)
    //         .patch(`/api/income/${idToUpdate}`)
    //         // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //         .send({
    //           ...updateIncome,
    //           fieldToIgnore: 'should not be in GET response'
    //         })
            
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/income/${idToUpdate}`)
    //             // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //             .expect(expectedIncome)
    //         )
    //     });
    //   });
    // });

});

