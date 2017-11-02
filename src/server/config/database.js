const mongoose = require('mongoose');

// Database Connection
function setupDb() {
  mongoose.Promise = global.Promise;
  const env = process.env.NODE_ENV;
  const dbConnectionString = (env === 'testing')
    ? 'mongodb://127.0.0.1:27017/parkingDb'
    : '';
  mongoose.connect(dbConnectionString);
  return mongoose.connection;
}

module.exports = setupDb;