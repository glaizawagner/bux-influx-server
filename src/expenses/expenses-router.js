/* eslint-disable quotes */
const path = require('path');
const express = require('express');

const logger = require('../logger');
const { requireAuth } = require('../middleware/jwt-auth');
const expensesRouter = express.Router();
const ExpensesService = require('./expenses-service');
const jsonParser = express.json();


/* expenses routes */
expensesRouter
  .route('/')
  .get(requireAuth,(req, res, next) => {
    ExpensesService.getAllExpenses(
      req.app.get('db'), 
      req.user.uid
      )
      .then(expenses => {
          res.json(ExpensesService.serializeExpenses(expenses));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    for(const field of ['description']) {
      if(!req.body[field]) {
        logger.error(`${field} is required`);
          return res.status(400).send({
            error: { message: `'${field}' is required`}
          });
      }
    }

    const { date_created, type, description, value, percentage } = req.body;

    const newExpenses= { date_created, type, description, value, percentage };

    newExpenses.user_id = req.user.uid;

    ExpensesService.insertExpenses(
      req.app.get('db'),
      newExpenses,
      req.user.uid
      )
      .then(expenses => {
        logger.info(`Expenses with id ${expenses.eid} created`);
        res
        .status(201)
        .location(path.posix.join(req.originalUrl) + `/${expenses.eid}`)
        .json(ExpensesService.serializeExpense(expenses));
      })
      .catch(next);
  });

  expensesRouter
  .route('/:eid')
  .all(requireAuth, (req, res, next) => {
    const { eid } = req.params;

    const knexInstance = req.app.get('db');
    ExpensesService.getById(knexInstance, eid)
      .then(expenses => {
          //make sure we found a expenses
          if(!expenses) {
            logger.error(`Expenses with id ${eid} not found.`);
              return res.status(404).json({
                error: { message: `Expenses doesn't exist` }
              });
          }
          res.expenses = expenses;
          next();
      })
      .catch(next);
    })
    .get(requireAuth,(req, res, next) => {
      res.json(ExpensesService.serializeExpense(res.expenses));
    })
    .delete(requireAuth,(req, res, next) => {
      const { eid } = req.params;
     
      const knexInstance = req.app.get('db');
      ExpensesService.deleteExpenses(
        knexInstance, 
        eid)
        .then( expense => {
            logger.info(`Expenses with id ${eid} deleted.`);
            res.status(204).json(expense);
        })
        .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { date_created, type, description, value, percentage } = req.body;
        const expensesToUpdate = { date_created, type, description, value, percentage };
        const { eid } = req.params;

        const numberOfValues = Object.values(expensesToUpdate).filter(Boolean).length;
          if (numberOfValues === 0)
            return res.status(400).json({
              error: {
                message: `Request body must contain 'description'`
            }
          });
      
        const knexInstance = req.app.get('db');
        ExpensesService.updateExpenses(
          knexInstance,
          eid,
          expensesToUpdate
        )
          .then( () => {
            res.status(204).end();
          })
          .catch(next);
});

module.exports = expensesRouter;