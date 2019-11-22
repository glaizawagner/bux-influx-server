function makesIncomeArray() {
    return [
        {
            iid: 1,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'inc',
            description: 'Salary',
            value: '3500.00'
        },
        {
            iid: 2,
            date_created: '2019-11-12T16:28:32.615Z',
            type: 'inc',
            description: 'Other Income',
            value: '1500.00'
        },

    ];
}

function makeMaliciousIncome() {
    const maliciousIncome = {
        iid: 911,
        date_created: '2019-11-12T16:28:32.615Z',
        type: 'inc',
        description: 'Naughty naughty very naughty <script>alert("xss");</script>',
        value: '3500.00'
    }
    const expectedIncome = {
        ...maliciousIncome,
        description: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }

    return {
        maliciousIncome,
        expectedIncome
    }
}

module.exports = {
    makesIncomeArray,
    makeMaliciousIncome
}