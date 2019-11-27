const xss = require('xss');
const Treeize = require('treeize');

const ExpensesService = {
    getAllExpenses(db) {
        // console.log(db)
        return db
            .from ('expenses as exp')
            .select(
                'exp.eid',
                'exp.date_created',
                'exp.type',
                'exp.description',
                'exp.value',
                'exp.percentage',
                ...userFields,
            )
                .leftJoin(
                    'users AS usr',
                    'exp.user_id',
                    'usr.uid',
                )
            .groupBy('exp.eid', 'usr.uid')

    },
    serializeExpenses(expenses){
        return expenses.map(this.serializeExpense)
    },

    serializeExpense(exp) {
        return {
            eid: exp.eid,
            date_created: exp.date_created,
            type: exp.type,
            description: xss(exp.description),
            value: exp.value,
            user_id: exp.user_id
        }

    },

    getById(db, id, user_id) {
        return ExpensesService.getAllExpenses(db, user_id)
        .where('exp.eid', id)
        .first();
    },

    getUserAllExpenses(db, user_id) {
        return db
        .select('*')
        .from('expenses')
        .where({user_id: user_id})
    },

    insertExpenses(db, newExpenses) {
        return db
        .insert(newExpenses)
        .into('expenses')
        .returning('*')
        .then(rows => {
            return rows[0];
        });
    },
    deleteExpenses(db, id) {
        return db('expenses')
          .where('eid', id)
          .delete();
    },
    updateExpenses(db, id, newExpenseFields) {
        return db('expenses')
          .where('eid', id)
          .update(newExpenseFields);
    },

};

const userFields = [
    'usr.uid AS user:uid',
    'usr.user_name AS user:user_name', 
    'usr.full_name AS user:full_name',
    'usr.nickname AS user:nickname',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
]
module.exports = ExpensesService;