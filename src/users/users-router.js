/* eslint-disable no-console */
/* eslint-disable quotes */
const express = require('express');
const path = require('path');
const UsersService = require('../users/users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('../auth/auth-service');
const IncomeService = require('../income/income-service');
const ExpenseService = require('../expenses/expenses-service');

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, nickname } = req.body;

    for (const field of ['full_name', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = UsersService.validatePassword(password);

    if (passwordError){
      return res.status(400).json({ error: passwordError });
    }

     UsersService.hasUserWithUserName(
        req.app.get('db'),
        user_name
     )
        .then(hasUserWithUserName => {
          if (hasUserWithUserName)
            return res.status(400).json({ error: `Username already taken` });

            return UsersService.hashPassword(password)
                .then(hashedPassword => {
                  const newUser = {
                    user_name,
                    password: hashedPassword,
                    full_name,
                    nickname,
                    date_created: 'now()',
                    };
                        
                        return UsersService.insertUser(
                          req.app.get('db'),
                          newUser
                        )
                        .then(user => {
                            res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${user.uid}`))
                            .json(UsersService.serializeUser(user));
                    });
                });
        })
        .catch(next);
  });

  // usersRouter
  // .route('/current-user')
  // .get((req, res, next) => {
  //     const authToken = req.get('Authorization') || '';

  //     let basicToken;
  //     if (!authToken.toLowerCase().startsWith('basic ')) {
  //         return res.status(401).json({ error: 'Missing basic token' });
  //     } else {
  //         basicToken = authToken.slice('basic '.length, authToken.length);
  //     }

  //     const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken);

  //     if (!tokenUserName || !tokenPassword) {
  //         return res.status(401).json({ error: 'Unauthorized request' });
  //     }

  //     AuthService.getUserWithUserName(
  //         req.app.get('db'),
  //         tokenUserName
  //     )
  //         .then(user => {
  //             return user;
  //         });
  // });

  usersRouter
  .route('/current-user')
  .all(requireAuth)
  .get((req, res) => {
      const currentUser = {
        user_name: req.user.user_name,
        uid: req.user.uid
      };

      return res.status(200).json(UsersService.serializeUser(currentUser));
  });

  usersRouter
  .route('/:uid/income')
  .get((req, res,next) => {
    IncomeService.getUserAllIncome(req.app.get('db'), req.params.uid)
      .then(income => {
          res.json(income.map(IncomeService.serializeIncome));
      })
    .catch((err) => {
        console.log(err);
        next(err);
    });
  });

  usersRouter
  .route('/:uid/expenses')
  .get((req, res,next) => {
    ExpenseService.getUserAllExpenses(req.app.get('db'), req.params.uid)
      .then(expense => {
          res.json(expense.map(ExpenseService.serializeExpense));
      })
    .catch((err) => {
        console.log(err);
        next(err);
    });
  });


module.exports = usersRouter;