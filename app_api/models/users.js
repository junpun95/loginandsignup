//user schema is kinda like a structure that defines the need for specific info
//crypto module checks the setting and checking of password
//randomBytes is to create random salt and pbkdf2Sync is to create hash
var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

//save reference to password 
userSchema.methods.setPassword = function(password){
//set the salt
    this.salt = crypto.randomBytes(16).toString('hex');
//set the hash
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

//encrypt the salt and pass & see if output == stored hash
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

//allow secured info exchange as JSON object

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    phone: this.phone,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // insider FILE_NAME for hashing algorithm
};

mongoose.model('User', userSchema);
