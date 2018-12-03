const module = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function(passport){
  passport.serializeUser((user,done){
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
  function (req, email, password, done){

  }));
}
