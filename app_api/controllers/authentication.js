//register controller
//creates new user
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


//take data from submitted form and create new mongoose model
module.exports.register = function(req, res) {
    
  var user = new User();

  user.phone = req.body.phone;
  user.email = req.body.email;

  user.setPassword(req.body.password);

//save user info
//status 200 = successful
  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

//login controller
module.exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport errors, send error 404 code
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found, generate token
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found, send error 401 code (unauthorized access) 
        res.status(401).json(info);
    }
  })(req, res);

};