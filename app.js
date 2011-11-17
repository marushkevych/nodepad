
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepad');

var Document =  require('./models.js').Document;




// Configuration

app.configure(function(){
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

// List
app.get('/documents', function(req, res) {
    Document.find({}, function (err, docs) {
        res.send(docs);
    });
});

// Create
app.post('/documents', function(req, res) {

    if(!req.body.title || !req.body.data)
    {
        //routes.index(req, res);
        res.render('index', req.body);
        return;
    }
    var instance = new Document();
    instance.title = req.body.title;
    instance.data = req.body.data;
    instance.save(function (err) {
      //
    });

    res.render('confirm', req.body);
});

// Read
app.get('/documents/:id', function(req, res) {
    Document.findById(req.params.id, function (err, doc){
        res.send(doc);
    });
});

app.get('/documents/:id/html', function(req, res) {
    Document.findById(req.params.id, function (err, doc){
        res.render('index', doc);
    });
});

// Update
app.put('/documents/:id.:format?', function(req, res) {
});

// Delete
app.del('/documents/:id.:format?', function(req, res) {
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
