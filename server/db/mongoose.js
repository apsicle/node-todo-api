var mongoose = require('mongoose');

// This file loads mongoose, connects it to our local database and then attaches it to exports

// mongoose does cool shiz. Instead of passing a callback to the Mongo native driver (so your commands
// wait until the connection is made). mongoose just handles all that in the background.

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports.mongoose = mongoose;