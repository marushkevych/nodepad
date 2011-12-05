// Mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepad');

var Document =  require('./models.js').Document;
var User =  require('./models.js').User;


exports.new = function(req, res){
  //res.render('index', {d:{ title: '', data: '' }})
  res.render('new', {d: new Document()})

};

function logObject(o)
{
    for(var i in o){
        console.log(i +'='+o[i]);
    }
}

exports.autocomplete = function(req, res) {
    var term = req.query["term"];
    var regex = new RegExp(term, 'i');

    Document.find({title: regex}, ['title'], function (err, docs) {
        if(err) throw err;

        var result = [];
        for(var i in docs) {
            result.push(docs[i].title);
        }

        res.send(result);
    });

};

exports.search = function(req, res) {

    var term = req.query["term"];
    var query = {};
    if(term) query.title = new RegExp(term, 'i');

    Document.find(query, function (err, docs) {
        if(err) throw err;

        res.send(docs);
    });

};

exports.list = function(req, res) {
    Document.find({}, function (err, docs) {
        if(err) throw err;

        if(req.accepts('html')) {
            //res.render('documents', { documents: docs });
            res.render('nodepad', { documents: docs });
        } else {
            res.send(docs);
        }
    });

};


exports.create = function(req, res) {
    var doc = req.body.document;
    var instance = new Document();
    instance.title = doc.title;
    instance.data = doc.data;
    instance.save(function (err) {
        if(err) throw err;
    });

    if(req.accepts('html')) {
        res.render('confirm', instance);
    } else {
        res.send(instance._id);
    }
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
    // updates can only be for data or for title
    var update = {data: doc.data, title: doc.title};
    var options = { multi: false };
    
    console.log(req.params.id);
    console.log(doc.title);
    console.log(doc.data);

    Document.update(conditions, update, options, function (err, doc) {
        if(err) throw err;
    });
};

exports.remove = function(req, res) {
    var doc = req.body.document;
    Document.remove({ _id: req.params.id }, function (err, doc) {
        if(err) throw err;
    });

    exports.list(req, res);
};

exports.getLogin = function(req, res) {
    res.render('login',{layout: 'loggedout'});
};

exports.logout = function(req, res) {

    console.log("logging out!");
    req.session.user = null;
    res.redirect('/sessions');
};

exports.login = function(req, res) {

    if (req.body.user.name) {
        User.findOne({ name: req.body.user.name}, function (err, user){
            if (user) {

                // check password
                if(user.authenticate(req.body.user.password)) {
                    req.session.user = user;
                    //exports.list(req, res);
                    res.redirect('/view.html');
                } else {
                    exports.getLogin(req, res);
                }

            } else {
                exports.getLogin(req, res);
            }
        });
    } else {
        exports.getLogin(req, res);
    }
};

exports.getRegister = function(req, res) {
    var message = req.error || '';
    res.render('register',{layout: 'loggedout', message: message});
}

exports.register = function(req, res) {
    var user = req.body.user;

    if(user.name && user.password) {

        var instance = new User();
        instance.name = user.name;
        instance.password = user.password;

        instance.save(function (err) {
            if(err) {
                console.log(err.message);
                req.error = err;
                exports.getRegister(req, res);
            }
            else {
                exports.getLogin(req, res);
            }
        });
    } else {
        exports.getRegister(req, res);
    }
};