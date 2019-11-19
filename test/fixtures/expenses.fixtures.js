function makesExpensesArray() {
    return [
        {
            iid: 1,
            date_created: '11/01/2019',
            type: '+',
            description: 'Salary',
            value: '3500.00',
            percentage: '17.00',
        },
        {
            iid: 2,
            date_created: '11/15/2019',
            type: '+',
            description: 'Other Expenses',
            value: '1500.00',
            percentage: '15.00'
        },

    ];
}

function makeMaliciousExpenses() {
    const maliciousExpenses = {
        date_created: '11/01/2019',
        type: '+',
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