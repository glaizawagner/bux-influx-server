/* eslint-disable quotes */
const express = require('express');
const path = require('path');
const logger = require('../logger');
const { requireAuth } = require('../middleware/jwt-auth');
const incomeRouter = express.Router();
const IncomeService = require('./income-service');
const jsonParser = express.json();

/* income routes */
incomeRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    IncomeService.getAllIncome(
      req.app.get('db'),
      req.user.uid
      )
      .then(incomes => {
          res.json(IncomeService.serializeIncome(incomes));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { date_created, type, description, value } = req.body;
    const newIncome= { date_created, type, description, value };

    for(const [key, value] of Object.entries(newIncome)) {
      if(value === null) {
        logger.error(`${key} is required`);
          return res.status(400).send({
            error: {message: `Missing ${key}' is required`}
          });
      }
    }

    newIncome.user_id = req.user.uid;

    IncomeService.insertIncome(
      req.app.get('db'), 
      newIncome,
      req.user.uid
     )
      .then(income => {
        logger.info(`Income with id ${income.iid} created`);
        res
        .status(201)
        .location(path.posix.join(req.originalUrl) + `/${income.iid}`)
        .json(IncomeService.serializeIncome(income));
      })
      .catch(next);
  });

  incomeRouter
  .route('/:iid')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { iid } = req.params;

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
    .get(requireAuth, (req, res, next) => {
      res.json(IncomeService.serializeIncome(res.income));
    })
    .delete(requireAuth,(req, res, next) => {
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

// /* async/await syntax for promises */
// async function checkIncomeExists(req, res, next) {
//   try {
//     const income = await IncomeService.getById(
//       req.app.get('db'),
//       req.params.iid
//     )

//     if (!income)
//       return res.status(404).json({ 
//         error: { message: `Income doesn't exist`}
//       })

//     res.income = income
//     next()
//   } catch (error) {
//     next(error)
//   }
// }


module.exports = incomeRouter;