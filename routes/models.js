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
var UserSchema = new Schema({
    name     : { type: String, set: toLower, unique: true }
  , password : { type: String, set: doEncrypt }
  , salt     : { type: String, default: makeSalt}

});

UserSchema.methods.authenticate = function (password) {
    return this.password === this.encryptPassword(password);
};

UserSchema.methods.encryptPassword = doEncrypt;

function makeSalt() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
}
function doEncrypt(text) {
    return crypto.createHmac('sha1', this.salt).update(text).digest('hex');
}

function toLower(value) {
    return value.toLowerCase();
}


exports.Document = mongoose.model('Document', DocumentSchema);
exports.User = mongoose.model('User', UserSchema);

