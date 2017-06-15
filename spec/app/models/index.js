const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

// Enable logging if not testing
(process.env.NODE_ENV === 'test') ||
  mongoose.set('debug', true);


const models = {};




module.exports = models;





