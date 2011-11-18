var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DocumentSchema = new Schema({
    title     : String
  , data      : String
  , tags      : String
});

exports.Document = mongoose.model('Document', DocumentSchema);

