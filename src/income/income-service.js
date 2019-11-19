const IncomeService = {
    getAllIncome(knex) {
        return knex.select('*').from('income');
    },
    getById(knex, id) {
        return knex.from('income')
        .select('*')
        .where('iid', id)
        .first();
    },
    insertIncome(knex, newIncome) {
        return knex
        .insert(newIncome)
        .into('income')
        .returning('*')
        .then(rows => {
            return rows[0];
        });
    },
    deleteIncome(knex, id) {
        return knex('income')
          .where('iid', id)
          .delete();
    },
    updateIncome(knex, id, newincomeFields) {
        return knex('income')
          .where('iid', id)
          .update(newincomeFields);
    },

};

module.exports = IncomeService;