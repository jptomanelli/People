var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoInc = require('mongoose-auto-increment');
var ev = require('dotenv').config()
var connection = mongoose.connect(
  'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS +'@' + process.env.DB_HOST + ''
);
autoInc.initialize(connection);

var userSchema = new Schema({
  name: String,
  favoriteCity: String,
});

userSchema.plugin(autoInc.plugin, 'User');
var User = mongoose.model('User', userSchema);

module.exports = User;
