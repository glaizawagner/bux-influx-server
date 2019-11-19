/* eslint-disable no-console */
const { NODE_ENV } = require('./config');
const logger = require('./logger');

function errorHandler(error, req, res, next) {
    let response;
  
    if(NODE_ENV === 'production'){
      response = { error : { message: 'server error'} };
    } else {
      console.error(error);
      logger.error(error);
      response = { error : { message: 'server error'} };
    }
    res.status(500).json(response);
  }

  module.exports = errorHandler;