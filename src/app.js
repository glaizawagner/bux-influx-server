/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
const incomeRouter = require('./income/income-router');
// const expensesRouter = require('./expenses/expenses-router');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/income', incomeRouter);
// app.use('/api/expenses', expensesRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);


// //For Get
// app.get('/user', (req, res) => {
//     //it will return full list of users
//     res.json(users);
// });

// app.get('/user/:userId', (req, res) => {
//   //it will return userId 
//   res.send(`The id was: ${req.params.userId}`);
// });

// //For Post
// const users = [
//   {
//     'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
//     'username': 'sallyStudent',
//     'password': 'c00d1ng1sc00l',
//     'favoriteClub': 'Cache Valley Stone Society',
//     'newsLetter': 'true'
//   },
//   {
//     'id': 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
//     'username': 'johnBlocton',
//     'password': 'veryg00dpassw0rd',
//     'favoriteClub': 'Salt City Curling Club',
//     'newsLetter': 'false'
//   }
// ];

// //Constructing an object and pushing it to the array
// app.post('/register', (req,res) => {

//   const id = uuid();
//   const newUser = { id, username, password, favoriteClub, newsLetter };
  
//   users.push(newUser);
  
//   // res.status(201).location(`http://localhost:8000/user/${id}`).json(newUser);
//   res.status(201).location(`http://localhost:8000/user/${id}`).json({id: id});
    
// });

// app.post('/user', (req,res) => {
//   //get the data
//   const { username, password, favoriteClub, newsLetter=false } = req.body;
  
//   // All are required, check if they were sent
//   if(!username){
//     return res.status(400).send('Username required');
//   }

//   if(!password){
//     return res.status(400).send('Password required');
//   }

//   if(!favoriteClub){
//     return res.status(400).send('favorite Club required');
//   }

//   // make sure username is correctly formatted.
//   if(username.length < 6 || username.length > 20){
//     return res.status(400).send('Username must be between 6 and 20 characters');
//   }

//   // password length
//   if(password.length < 8 || password.length > 36){
//     return res.status(400).send('Password must be between 8 and 36 characters');
//   }

//   // password contains digit, using a regex here
//   if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
//     return res.status(400).send('Password must be contain at least one digit');
//   }

//   const clubs = [
//     'Cache Valley Stone Society',
//     'Ogden Curling Club',
//     'Park City Curling Club',
//     'Salt City Curling Club',
//     'Utah Olympic Oval Curling Club'
//   ];

//   // make sure the club is valid
//   if(!clubs.includes(favoriteClub)){
//     return res.status(400).send('Not a valid club');
//   }

//   // at this point all validation passed
//   res.send('All validation passed');

// });

// //For delete
// app.delete('/user/:userId', (req, res) => {
//   const { userId } = req.params;
 
//   //findIndex to find the index of that user
//   const index = users.findIndex(u => u.id === userId);

//   // make sure we actually find a user with that id
//   if(index === -1) {
//     return res.status(400).send('User not found');
//   }

//   //Using splice to remove that user
//   users.splice(index, 1);

//   // 204 means No Content
//   res.status(204).end();
// });

module.exports = app;