const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node.js');

const userSchema = new mongoose.Schema({
  local:{
    email: String,
    password: String
  }
}) ;

UserSchema.methods.hashingPassword = function(password){
  return SHA2.SHA256(password).toString('hex')
}

UserSchema.methods.validatePassword = function(password){
  password = SHA2.SHA256(password).toString('hex')
  return password == (this.local.password)
}

module.exports = moongose.model('User', userSchema);
