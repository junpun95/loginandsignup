//property name of our model = sohai
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  if (!req.sohai._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.sohai._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};
