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

	//var value = new User({ login: "seba", password: "pepe", locked: false });
	//value.save(printBDError);
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

//http.globalAgent.maxSockets = 50;


// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  //if (req.session && req.session.user === "amy" && req.session.admin)
  if (req.session && req.session.user && req.session.admin)  
    return next();
  else
    //return res.sendStatus(401);
   return res.redirect("/index")
};

// Index pages
app.get('/', function (req, res) {
  res.render('index');
})

app.get('/index', function (req, res) {
  res.render('index');
})

app.get('/users', auth, function (req, res) {
  res.render('users');
})

app.get('/home', function (req, res) {
  if (req.session.admin)
  	res.render('/home');
  else
  	res.redirect("/")
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
				res.send("login success!");
			}
			else
			res.send('login failed');
		}); 
});
 
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})