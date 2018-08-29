
const express = require('express')
const session = require('express-session');
const querystring = require('querystring');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const sitePort = 80;


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
app.use(session({ secret: '2C44-4D44-WppQ38S', resave: true, saveUninitialized: true }));


initializeDatabase();


// Authentication and Authorization Middleware
const auth = function(req, res, next) {
  if (req.session && req.session.user && req.session.admin)  
    return next();
  else
    return res.redirect("/index")
};

// Static content
app.use(express.static('/public/images'));
app.use(express.static('/public/css'));
app.use(express.static('public'));
	
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

// Login
app.post('/login', function (req, res) {
  // Check null value
  if (!req.body.username || !req.body.password)
    res.send('login failed');
  else
    // Select user
    User.find( 
      { login: req.body.username }, 
      function(err, entities) {
        var result = entities[0];
        if (result != null && (req.body.password == result.password)) {
          req.session.username = req.body.username;
          req.session.admin = true;
          req.session.errorMessage = "Welcome, " + req.session.username;
        }
        else {
          req.session.admin = false;
          req.session.errorMessage = "Login failed";		
        }
        
	res.redirect("/index");
      }); 
});

// Logout
app.route('/logout')
  .get(function(req, res) {
    req.session.destroy();
    res.redirect("/index");
  })
  .post(function (req, res) {
    req.session.destroy();
    res.redirect("/index");
  });

// Main functionality
app.get('/entities', auth, function (req, res) {
  res.render('entities', { entities: [ 1, 2, 3 ] });
  return;
});

app.get('/users', auth, function (req, res) {
  res.render('users', { users: [ 1, 2, 3 ] });
});


// Application start
app.listen(sitePort, function () {
  console.log('Example app listening on port ' + sitePort.toString() + '!')
});


