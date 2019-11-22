/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
const incomeRouter = require('./income/income-router');
const expensesRouter = require('./expenses/expenses-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/income', incomeRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

module.exports = app;