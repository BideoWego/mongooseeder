const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  email: String
}, {
  timestamps: true
});

var User = mongoose.model('User', UserSchema);




module.exports = User;




