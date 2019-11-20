function makesExpensesArray() {
    return [
        {
            eid: 1,
            date_created: '2019-11-12T16:28:32.615Z',
            type: '-',
            description: 'Salary',
            value: '3500.00',
            percentage: '17.00',
        },
        {
            eid: 2,
            date_created: '2019-11-12T16:28:32.615Z',
            type: '-',
            description: 'Other Expenses',
            value: '1500.00',
            percentage: '15.00'
        },

    ];
}

function makeMaliciousExpenses() {
    const maliciousExpenses = {
        eid: 911,
        date_created: '2019-11-12T16:28:32.615Z',
        type: '-',
        description: 'Naughty naughty very naughty <script>alert("xss");</script>',
        value: '3500.00',
        percentage: '17.00'
    }
    const expectedExpenses = {
        ...maliciousExpenses,
        description: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }

    return {
        maliciousExpenses,
        expectedExpenses
    }
}

module.exports = {
    makesExpensesArray,
    makeMaliciousExpenses
}