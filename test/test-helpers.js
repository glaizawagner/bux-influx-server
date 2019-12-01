const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//make user array
function makeUsersArray() {
  return [
    {
      uid: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      uid: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      uid: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      uid: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}


//make income user array
function makeIncomeArray(users) {
    return [
        {
            iid: 1,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'inc',
            description: 'Salary',
            value: '3500.00',
            user_id: users[0].uid
        },
        {
            iid: 2,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'inc',
            description: 'Other Income',
            value: '3500.00',
            user_id: users[1].uid
        }
    ];
}

//make expenses  user array
function makeExpensesArray(users) {
    return [
        {
            eid: 1,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'exp',
            description: 'Salary',
            value: '3500.00',
            percentage: '17.00',
            user_id: users[0].uid
        },
        {
            eid: 2,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'exp',
            description: 'Other Expenses',
            value: '1500.00',
            percentage: '15.00',
            user_id: users[0].uid
        },

    ];
}

//make expected income
function makeExpectedIncome(users, inc = []) {
  const user = users
    .find(user => user.uid === inc.user_id)
  
    return {
      iid: inc.iid,
      date_created: inc.date_created,
      type: inc.type,
      description: inc.description,
      value: inc.value,
      user: {
        uid: user.uid,
        user_name: user.user_name,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: user.date_created,
      },
    }
}

//make expected expenses
function makeExpectedExpenses(users, exp = []) {
  const user = users
    .find(user => user.uid === exp.user_id)
  
    return {
      eid: exp.eid,
      date_created: exp.date_created,
      type: exp.type,
      description: exp.description,
      value: exp.value,
      percentage: exp.percentage,
      user: {
        uid: user.uid,
        user_name: user.user_name,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: user.date_created,
      },
    }
}

//seed malicious income
function seedMaliciousIncome(db, user, income) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('income')
          .insert([income])
      );
}

//seed malicious expenses
function seedMaliciousExpenses(db, user, expense) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('expenses')
          .insert([expense])
      );
}

//make malicious income
function makeMaliciousIncome(user) {
    const maliciousIncome = {
        iid: 911,
        date_created: '2019-11-12T16:28:32.615Z',
        type: 'inc',
        description: `Naughty naughty very naughty <script>alert("xss");</script>`,
        value: '3500.00'
      
    }
    const expectedIncome = {
        ...makeExpectedIncome([user], maliciousIncome),
        description: `Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`,
    }
    return {
        maliciousIncome,
        expectedIncome
    }
}

//make malicious expenses
function makeMaliciousExpenses(user) {
    const maliciousExpenses = {
        eid: 911,
        date_created: '2019-11-12T16:28:32.615Z',
        type: 'exp',
        description: 'Naughty naughty very naughty <script>alert("xss");</script>',
        value: '3500.00',
        percentage: '17.00',
        user_id: user[1].uid
    }
    const expectedExpenses = {
        ...makeExpectedExpenses([user], maliciousExpenses),
        description: `Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`,
    }

    return {
        maliciousExpenses,
        expectedExpenses
    }
}

//make income fixtures
function makeIncomeFixtures() {
    const testUsersInc = makeUsersArray()
    const testIncome = makeIncomeArray(testUsersInc)
    return { testUsersInc, testIncome }
}

//make expenses fixtures
function makeExpensesFixtures() {
    const testUsersExp = makeUsersArray()
    const testExpenses = makeExpensesArray(testUsersExp)
    return { testUsersExp, testExpenses }
}

//clean tables
function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
      `TRUNCATE
        income,
        expenses,
        users
        RESTART IDENTITY CASCADE
        `
    )
      .then(() =>
        Promise.all([
            trx.raw('ALTER SEQUENCE income_iid_seq minvalue 0 START WITH 1'),
            trx.raw('ALTER SEQUENCE expenses_eid_seq minvalue 0 START WITH 1'),
            trx.raw('ALTER SEQUENCE users_uid_seq minvalue 0 START WITH 1'),
            trx.raw('SELECT setVal(\'income_iid_seq\',0)'),
            trx.raw('SELECT setVal(\'expenses_eid_seq\',0)'),
            trx.raw('SELECT setVal(\'users_uid_seq\',0)'),
        ])
      )
    )
}

//seeds users
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_uid_seq', ?)`,
          [users[users.length - 1].uid],
        )
      )
}

//seed income table
function seedIncomeTables(db, users, income = []) {
    return db.transaction(async trx => {
      await seedUsers(trx, users);
      await trx.into('income').insert(income);
      await trx.raw(
                 `SELECT setVal('income_iid_seq', ?)`,
                 [income[income.length - 1].iid],
               );
  })
}

//seed expenses table
function seedExpensesTables(db, users, expense = []) {
    return db.transaction(async trx => {
      await seedUsers(trx, users);
      await trx.into('expenses').insert(expense);
      await trx.raw(
                 `SELECT setval('expenses_eid_seq', ?)`,
                 [expense[inc.length - 1].eid],
               );
  })
}

//make auth header
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.uid }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    });
    return `Bearer ${token}`;
}
  
module.exports = {
    makeUsersArray,
    makeIncomeArray,
    makeExpensesArray,
    makeExpectedIncome,
    makeMaliciousIncome,
    makeMaliciousExpenses,
    cleanTables,
    seedIncomeTables,
    seedExpensesTables,
    makeIncomeFixtures,
    makeExpensesFixtures,
    makeAuthHeader,
    seedMaliciousIncome,
    seedMaliciousExpenses,
    seedUsers,
};