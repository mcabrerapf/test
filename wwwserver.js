var configuration = require('./backend/configuration/gamification').configuration,

    express = require("express"),
    app = express(),

	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  morgan = require('morgan'),

    User = require('./backend/controllers/users.js'),
    passport = require('passport'),
    session = require('express-session'),

    routes = require('./backend/routes'),
    rest = require('./backend/rest');

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(morgan('dev'));

app.set('trust proxy', 1);
app.use(session({
  secret: 'lampara.13',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

/*** Passport ***/
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

rest.setupREST(app);

/* Para PRODUCCIÓN!!
app.use(express.static('dist', {'index': 'index.html'}));
*/
/* Para DESARROLLO */
app.use(express.static('.tmp/serve', {'index': 'index.html'}));
app.use(express.static('src'));
app.use('/bower_components', express.static('bower_components'));
app.use('/assets', express.static('data'));
app.use(routes);

app.listen(configuration.wwwPort, function() {
  console.log("Node server running on http://localhost:" + configuration.wwwPort);
});
