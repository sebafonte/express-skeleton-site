
const express = require('express')
const session = require('express-session');
const querystring = require('querystring');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const sitePort = 80;

// Init database
var userSchema, User, postulantSchema, Entity;
const db = mongoose.createConnection('mongodb://localhost/rhdb');

function initializeDatabase() {	
    userSchema = mongoose.Schema({
        login: { type: String, trim: true, index: true },
        password: String,
        locked: Boolean
    });

    User = db.model('users', userSchema);	

    postulantSchema = mongoose.Schema({
        name: { type: String, trim: true, index: true },
        tel: { type: String, trim: true },
        data: String,
	tags: { type: String, trim: true },
	comment: { type: String, trim: true }
    });

    Entity = db.model('entities', postulantSchema);
}

function printBDError (err, result) {
      if (err) throw err;
      console.log(result);
}

// Init system
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(session({ secret: '9C54-4D44-WpRQ38S', resave: true, saveUninitialized: true }));


initializeDatabase();


// Authentication and authorization middleware
const auth = function(req, res, next) {
  if (req.session && req.session.username && req.session.admin)  
    return next();
  else
    return res.redirect("/index")
};

// Static content
app.use(express.static('public/images'));
app.use(express.static('public/css'));
app.use(express.static('public'));
	
// Index pages
app.get('/', function (req, res) {
  res.redirect("/index");
})

app.get('/index', function (req, res) {
  const message = req.session.errorMessage;
  req.session.errorMessage = "";

  if (req.session.username)
    res.render('home', { message: message });
  else
    res.render('index', { message: message });
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
      function(err, users) {
        var result = users[0];
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
    Entity.find( 
      { }, 
      function(err, entities) {
        if (err == null) {
	  res.render('entities', { entities: entities });
        }
        else {
          res.render('error', { message: "Can't get data from database." });
        }
      });
});

app.get('/users', auth, function (req, res) {
    User.find( 
      { }, 
      function(err, entities) {
        if (err == null) {
	  res.render('users', { users: entities });
        }
        else {
          res.render('error', { message: "Can't get data from database." });
        }
      });
});

app.get('/getEntityData', auth, function (req, res) {
    Entity.find( 
      { login: req.body.entityId }, 
      function(err, entities) {
        var result = entities[0];
        if (result != null) {
          res.sendFile(result);
        }
        else {
	// #TODO: Check correct behavior here	
        }
      });
});


// Application start
app.listen(sitePort, function () {
  console.log('Example app listening on port ' + sitePort.toString() + '!')
});


