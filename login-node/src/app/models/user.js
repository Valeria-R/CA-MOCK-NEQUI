const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const SHA2 = require('sha2');

const pocketSchema = new mongoose.Schema({
	pocketName: String,
	pocketSaldo: Number
});

const goalSchema = new mongoose.Schema({
	goalName: String,
	montoTotal: Number,
	dineroAhorrado: Number,
	dineroRestante: Number,
	estado: Boolean,
	fechaLimite: Date
});

const accountSchema = new mongoose.Schema({
	saldoTotal: Number,
	saldoDisponible: Number,
	mattress: Number,
	pockets:[pocketSchema],
	goals:[goalSchema]
});

const userSchema = new mongoose.Schema({
  local:{
    name: String,
    lastName: String,
    email: String,
    password: String
  },
  account: accountSchema
}) ;

userSchema.methods.hashingPassword = function(password){
  return SHA2.SHA256(password).toString('hex')
}

userSchema.methods.validatePassword = function(password){
  password = SHA2.SHA256(password).toString('hex')
  return password == (this.local.password)
}

module.exports = mongoose.model('User', userSchema);
