
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();



// Configuration

app.configure(function(){
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
    
  // access to req.session
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
    
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


// authentication



function checkLoggedIn(req, res, next) {

    if (req.session.user) {
        next();
    } else {
        res.redirect('/sessions');
    }
}



// Routes

// logged-put
app.get('/users', routes.getRegister);

app.post('/users', routes.register);

app.get('/sessions', routes.getLogin);

app.post('/sessions', routes.login);

app.del('/sessions', routes.logout);


// logged-in
app.get('/new', checkLoggedIn, routes.new);

// List
app.get('/', checkLoggedIn, routes.list);
app.get('/documents', checkLoggedIn, routes.list);

// Create
app.post('/documents', checkLoggedIn, routes.create);

// Read
app.get('/documents/:id', checkLoggedIn, routes.view);

// Update
app.put('/documents/:id', checkLoggedIn, routes.update);

// Delete
app.del('/documents/:id', checkLoggedIn, routes.remove);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
