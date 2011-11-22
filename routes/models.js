var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DocumentSchema = new Schema({
    title     : String
  , data      : String
  , tags      : String
});

var UserSchema = new Schema({
    name     : { type: String, unique: true }
  , password : String
});



exports.Document = mongoose.model('Document', DocumentSchema);
exports.User = mongoose.model('User', UserSchema);

