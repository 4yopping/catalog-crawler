var mongoose = require('mongoose');
mongoose.connect('mongodb://52.1.216.1:27017/links');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection stablished');
});

module.exports = mongoose;
