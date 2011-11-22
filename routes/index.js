// Mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepad');

var Document =  require('./models.js').Document;
var User =  require('./models.js').User;




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
    var conditions = { _id: req.params.id };
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
    Document.remove({ _id: req.params.id }, function (err, doc) {
        console.log(err);
        console.log(doc);
    });

    exports.list(req, res);
};


exports.login = function(req, res) {

    if (req.body.user.name) {
        User.findOne({ name: req.body.user.name}, function (err, user){
            if (user) {

                // check password
                if(user.password == req.body.user.password) {
                    req.session.user = user;
                    exports.new(req, res);
                } else {
                    res.render('login');
                }

            } else {
                res.render('login');
            }
        });
    } else {
        res.render('login');
    }
};

exports.register = function(req, res) {
    var user = req.body.user;

    if(user.name && user.password) {

        var instance = new User();
        instance.name = user.name;
        instance.password = user.password;

        instance.save(function (err) {
            //
        });
        res.render('login');
    } else {
        res.render('register');
    }
};