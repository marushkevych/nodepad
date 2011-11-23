var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// document
var DocumentSchema = new Schema({
    title     : String
  , data      : String
  , tags      : String
});

// user
var doEncrypt = function (text) {
    return crypto.createHmac('sha1', 'foo').update(text).digest('hex');
};

var UserSchema = new Schema({
    name     : { type: String, unique: true }
  , password : { type: String, set: doEncrypt }
});

UserSchema.methods.authenticate = function (password) {
    return this.password === this.encryptPassword(password);
};

UserSchema.methods.encryptPassword = doEncrypt;


exports.Document = mongoose.model('Document', DocumentSchema);
exports.User = mongoose.model('User', UserSchema);

