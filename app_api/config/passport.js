//Passport module should be top of the file with other general require statements
//in app.js we have to require the passport module, require passport config, initialize Passport as middleware just before API routes are added
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

//finding email & password instead of username & password
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
// invalid info
      if (err) { return done(err); }
// Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'EMAIL / Password is wrong'
        });
      }
// Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Email / PASSWORD is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));