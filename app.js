'use strict';

var routes = require('./routes/routes.js');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var exphbs = require('express-handlebars');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var helpers = require('./views/helpers/helpers.js');

var app = express();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport.js')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly,
    helpers: helpers
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// required for passport
app.use(session({ secret: 'instaresume' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(__dirname + '/public'));

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(app.get('port'));

console.log("Server listening on port " + app.get('port'));
