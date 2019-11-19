const ExpensesService = {
    getAllExpenses(knex) {
        return knex.select('*').from('expenses');
    },
    getById(knex, id) {
        return knex.from('expenses')
        .select('*')
        .where('eid', id)
        .first();
    },
    insertExpenses(knex, newExpenses) {
        return knex
        .insert(newExpenses)
        .into('expenses')
        .returning('*')
        .then(rows => {
            return rows[0];
        });
    },
    deleteExpenses(knex, id) {
        return knex('expenses')
          .where('eid', id)
          .delete();
    },
    updateExpenses(knex, id, newExpenseFields) {
        return knex('expenses')
          .where('eid', id)
          .update(newExpenseFields);
    },

};

module.exports = ExpensesService;