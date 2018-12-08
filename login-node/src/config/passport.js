const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function(passport){
  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err, user);
    });
  });

  passport.use('local-signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
             if (err) {
               return done(err);}
               if (user) {
                 return done(null, false, req.flash('signupMessage', 'the email is already taken'));}
                 else {
                   console.log(req.body);
                   var newUser = new User();
                   newUser.local.name = req.body.name;
                   newUser.local.lastName = req.body.lastName;
                   newUser.local.email = req.body.email;
                   newUser.local.password = newUser.hashingPassword(req.body.password);
                   newUser.account = {
	                    saldoTotal: 0,
	                    saldoDisponible: 0,
	                    matress: 0,
	                    pockets: [],
	                     goals: []
                    }
                   newUser.save(function (err) {
                     if (err) { throw err; }
                     return done(null, newUser);
                   });
                 }
               });
             }));

  passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, user) {
      if (err) {
        return done(err);
      }if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }if (!user.validatePassword(password)) {
        return done(null,false,req.flash('loginMessage', 'Wrong password'));
      }
      return done(null, user);
      });
  }));

}
