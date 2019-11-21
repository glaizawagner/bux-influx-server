/* eslint-disable quotes */
const path = require('path');
const express = require('express');
const xss = require('xss');
const logger = require('../logger');

const incomeRouter = express.Router();
const IncomeService = require('./income-service');
const jsonParser = express.json();

const serializeIncome= income => ({
  iid: income.iid,
  date_created: income.date_created,
  type: income.type,
  description: xss(income.description),
  value: income.value,
});

/* income routes */
incomeRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    IncomeService.getAllIncome(knexInstance)
      .then(income => {
        if(!income){
          return res.status(400).json({
            error: { message: `Income doesn't exist` }
          });
        }
        res.json(income.map(serializeIncome));
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

    const { date_created, type, description, value } = req.body;
    
    // if(!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
    //   logger.error(`Invalid rating '${rating}' supplied`);
    //     return res.status(400).send({
    //       error: { message: `'rating' must be a number between 0 and 5`}
    //     });
    // }

    const newIncome= { date_created, type, description, value };

    const knexInstance = req.app.get('db');
    IncomeService.insertIncome(knexInstance, newIncome)
      .then(income => {
        logger.info(`Income with id ${income.iid} created`);
        res
        .status(201)
        .location(path.posix.join(req.originalUrl) + `/${income.iid}`)
        .json(serializeIncome(income));
      })
      .catch(next);
  });

  incomeRouter
  .route('/:iid')
  .all((req, res, next) => {
    const { iid } = req.params;

    const knexInstance = req.app.get('db');
    IncomeService.getById(knexInstance, iid)
      .then(income => {
          //make sure we found a income
          if(!income) {
            logger.error(`Income with id ${iid} not found.`);
              return res.status(404).json({
                error: { message: `Income doesn't exist` }
              });
          }
          res.income = income;
          next();
      })
      .catch(next);
    })
    .get((req, res, next) => {
      res.json(serializeIncome(res.income));
    })
    .delete((req, res, next) => {
      const { iid } = req.params;
     
      const knexInstance = req.app.get('db');
      IncomeService.deleteIncome(knexInstance, iid)
        .then( income => {
            logger.info(`Income with id ${iid} deleted.`);
            res.status(204).json(income);
        })
        .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { date_created, type, description, value } = req.body;
        const incomeToUpdate = { date_created, type, description, value };
        const { iid } = req.params;

        const numberOfValues = Object.values(incomeToUpdate).filter(Boolean).length;
          if (numberOfValues === 0)
            return res.status(400).json({
              error: {
                message: `Request body must contain 'description'`
            }
          });
      
        const knexInstance = req.app.get('db');
        IncomeService.updateIncome(
          knexInstance,
          iid,
          incomeToUpdate
        )
          .then( () => {
            res.status(204).end();
          })
          .catch(next);
});

module.exports = incomeRouter;