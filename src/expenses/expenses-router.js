/* eslint-disable quotes */
const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');

const expensesRouter = express.Router();
const ExpensesService = require('./expenses-service');
const jsonParser = express.json();

const serializeExpenses= expenses => ({
  eid: expenses.eid,
  date_created: expenses.date_created,
  type: expenses.type,
  description: xss(expenses.description),
  value: expenses.value,
  percentage: expenses.percentage
});

/* expenses routes */
expensesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ExpensesService.getAllExpenses(knexInstance)
      .then(expenses => {
        if(!expenses){
          return res.status(400).json({
            error: { message: `Expenses doesn't exist` }
          });
        }
        res.json(expenses.map(serializeExpenses));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    for(const field of ['description']) {
      if(!req.body[field]) {
        logger.error(`${field} is required`);
          return res.status(400).send({
            error: {message: `'${field}' is required`}
          });
      }
    }

    const { date_created, type, description, value, percentage } = req.body;
    
    // if(!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
    //   logger.error(`Invalid rating '${rating}' supplied`);
    //     return res.status(400).send({
    //       error: { message: `'rating' must be a number between 0 and 5`}
    //     });
    // }

    const newExpenses= { date_created, type, description, value, percentage };

    const knexInstance = req.app.get('db');
    ExpensesService.insertExpenses(knexInstance, newExpenses)
      .then(expenses => {
        logger.info(`Expenses with id ${expenses.eid} created`);
        res
        .status(201)
        .location(path.posix.join(req.originalUrl) + `/${expenses.eid}`)
        .json(serializeExpenses(expenses));
      })
      .catch(next);
  });

  expensesRouter
  .route('/:eid')
  .all((req, res, next) => {
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
    .get((req, res, next) => {
      res.json(serializeExpenses(res.expenses));
    })
    .delete((req, res, next) => {
      const { eid } = req.params;
     
      const knexInstance = req.app.get('db');
      ExpensesService.deleteExpenses(knexInstance, req.params.eid)
        .then( () => {
            logger.info(`Expenses with id ${eid} deleted.`);
            res.status(204).end();
        })
        .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { date_created, type, description, value, percentage } = req.body;
        const expensesToUpdate = { date_created, type, description, value, percentage };
      
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
          req.params.eid,
          expensesToUpdate
        )
          .then( () => {
            res.status(204).end();
          })
          .catch(next);
});

module.exports = expensesRouter;