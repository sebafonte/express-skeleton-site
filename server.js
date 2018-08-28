// localhost:3000/login?username=amy&password=amypassword
// localhost:3000/home

const express = require('express')
const session = require('express-session');
const querystring = require('querystring');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express()

function initializeDatabase() {	
    userSchema = mongoose.Schema({
        login: { type: String, trim: true, index: true },
        password: String,
        locked: Boolean
    });

    User = db.model('users', userSchema);	
}

function printBDError (err, result) {
      if (err) throw err;
      console.log(result);
}

// Init database
var userSchema, User;
const db = mongoose.createConnection('mongodb://localhost/rhdb');

// Init system
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));


initializeDatabase();


// Authentication and Authorization Middleware
const auth = function(req, res, next) {
  if (req.session && req.session.user && req.session.admin)  
    return next();
  else
    return res.redirect("/index")
};

	
// Index pages
app.get('/', function (req, res) {
  res.redirect("/index");
})

app.get('/index', function (req, res) {
  const message = req.session.errorMessage;
  req.session.errorMessage = "";

  if (req.session.username)
    res.render('home', { errorMessage: message });
  else
    res.render('index', { errorMessage: message });
})

app.get('/users', auth, function (req, res) {
  res.render('users');
})


// Login endpoint
app.post('/login', function (req, res) {
	// Check null value
 	if (!req.body.username || !req.body.password)
	    res.send('login failed');
	else
	// Select user
	User.find( 
		{ login: req.body.username } , 
		function(err, entities) {
			var result = entities[0];
			if (result != null && (req.body.password == result.password)) {
				req.session.username = req.body.username;
				req.session.admin = true;
				req.session.errorMessage = "Welcome, " + req.session.username;
				res.redirect("/index");
			}
			else {
				req.session.errorMessage = "Login failed";		
				res.redirect("/index");				
			}

		}); 
});
 
// Logout endpoint
app.post('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/index");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
