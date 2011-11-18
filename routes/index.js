// Mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepad');
var Document =  require('./models.js').Document;




exports.new = function(req, res){
  //res.render('index', {d:{ title: '', data: '' }})
  res.render('new', {d: new Document()})
};


exports.list = function(req, res) {
    Document.find({}, function (err, docs) {
        if(req.accepts('html')) {
            res.render('documents', { documents: docs });
        } else {
            res.send(docs);
        }
    });
};


exports.create = function(req, res) {
    var doc = req.body.document;
    if(!doc.title || !doc.data)
    {
        //routes.index(req, res);
        res.render('new', {d:doc});
        return;
    }
    var instance = new Document();
    instance.title = doc.title;
    instance.data = doc.data;
    instance.save(function (err) {
      //
    });

    res.render('confirm', doc);
};


exports.view = function(req, res) {
    Document.findById(req.params.id, function (err, doc){
        if(req.accepts('html')) {
            res.render('edit', {d:doc});
        } else {
            res.send(doc);
        }
    });
};

exports.update = function(req, res) {
    var doc = req.body.document;
    var conditions = { _id: doc.id };
    var update = { title: doc.title, data: doc.data};
    var options = { multi: false };

    Document.update(conditions, update, options, function (err, doc) {
        console.log(err);
        console.log(doc);
    });

    exports.list(req, res);
};

exports.remove = function(req, res) {
    var doc = req.body.document;
    Document.remove({ _id: doc.id }, function (err, doc) {
        console.log(err);
        console.log(doc);
    });

    exports.list(req, res);
};
