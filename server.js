// localhost:3000/login?username=amy&password=amypassword
// localhost:3000/home

const express = require('express')
const session = require('express-session');
const querystring = require('querystring');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express()

function initializeDatabase() {	
	userSchema = mongoose.Schema({
		login: { type: String, trim: true, index: true },
		password: String,
		locked: Boolean
	});

	User = db.model('users', userSchema);	
}

// Init database
var userSchema, User;
const db = mongoose.createConnection('mongodb://localhost/rhdb');
// Init system
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
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// Index pages
app.get('/', function (req, res) {
  res.render('index');
})

app.get('/index', function (req, res) {
  res.render('index');
})

app.get('/home', auth, function (req, res) {
  if (req.session.admin)
  	res.render('home');
  else
  	res.render('login');
})

// Login endpoint
app.post('/login', function (req, res) {

	function cb (err, body) {
	  // Log body
  	  console.log('err: ' + err);
  	  console.log('body: ' + body);

	  // Filter empty stuff
	  if (!req.body.username || !req.body.password)
	    res.send('login failed');
	  // Select user
	  User.find( 
	    { login: args.login } , 
	    function(err, entities) {
	      var result = entities[0];
	      if (result != null) {
		req.session.username = "amy";
		req.session.admin = true;
		res.send("login success!");
	      }
	      else
		res.send('login failed');
	    }); 
	}

  	//jsonBody(req, res, cb);
});
 
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
