var mongoose = require('mongoose');
mongoose.connect('mongodb://54.88.194.6:27017/links');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection stablished');
});

module.exports = mongoose;
