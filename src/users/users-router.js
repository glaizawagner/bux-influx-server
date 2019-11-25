/* eslint-disable quotes */
const express = require('express');
const path = require('path');
const UsersService = require('../users/users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();
// const { requireAuth } = require('../middleware/jwt-auth');

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { user_name, full_name, password, nickname } = req.body;
    const newUser = { user_name, full_name, password, nickname };

    for (const [key, value] of Object.entries(newUser))
      if (!value)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
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
                    newUser.password = hashedPassword;
                        
                        return UsersService.insertUser(
                          knexInstance,
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
  // .all(requireAuth)
  // .get((req, res) => {
  //   const currentUser = {
  //     user_name: req.user.user_name,
  //     user_id: req.user.uid
  //   };
  //   return res.status(200).json(UsersService.serializeUser(currentUser));
  // });


module.exports = usersRouter;