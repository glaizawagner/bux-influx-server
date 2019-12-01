const xss = require('xss');
// const Treeize = require('treeize');

const IncomeService = {
    getAllIncome(db) {
        return db
            .from ('income as inc')
            .select(
                'inc.iid',
                'inc.date_created',
                'inc.type',
                'inc.description',
                'inc.value',
                ...userFields
            )
                .leftJoin(
                    'users AS usr',
                    'inc.user_id',
                    'usr.uid'
                )
            .groupBy('inc.iid', 'usr.uid');

    },

    serializeIncomes(incomes){
        return incomes.map(this.serializeIncome);
    },

    serializeIncome(inc) {
        return {
            iid: inc.iid,
            date_created: inc.date_created,
            type: inc.type,
            description: xss(inc.description),
            value: inc.value,
            user_id: inc.user_id
        };
    },

    getById(db, id, user_id) {
        return IncomeService.getAllIncome(db, user_id)
        .where('inc.iid', id)
        .first();
    },

    getUserAllIncome(db, user_id) {
        return db
        .select('*')
        .from('income')
        .where({user_id: user_id});
    },

    insertIncome(db, newIncome) {
        return db
        .insert(newIncome)
        .into('income')
        .returning('*')
        .then(rows => {
            return rows[0];
        });
    },
    deleteIncome(db, id) {
        return db('income')
          .where('iid', id)
          .delete();
    },
    updateIncome(db, id, newincomeFields) {
        return db('income')
          .where('iid', id)
          .update(newincomeFields);
    },

};

const userFields = [
    'usr.uid AS user:uid',
    'usr.user_name AS user:user_name', 
    'usr.full_name AS user:full_name',
    'usr.nickname AS user:nickname',
    'usr.date_created AS user:date_created',
    'usr.date_modified AS user:date_modified',
];

module.exports = IncomeService;