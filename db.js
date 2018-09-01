// Init database
var userSchema, User, entitySchema, Entity;
const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/rhdb');

module.exports = {
    initializeDatabase: initializeDatabase,
    findUsers: findUsers,
    findEntities: findEntities
}

function initializeDatabase() {	
    userSchema = mongoose.Schema({
        login: { type: String, trim: true, index: true },
        password: String,
        locked: Boolean
    });

    User = db.model('users', userSchema);	

    entitySchema = mongoose.Schema({
        name: { type: String, trim: true, index: true },
        tel: { type: String, trim: true },
        data: String,
	tags: { type: String, trim: true },
	comment: { type: String, trim: true }
    });

    Entity = db.model('entities', entitySchema);
}

function printBDError (err, result) {
      if (err) throw err;
      console.log(result);
}

function findUsers(filter, callback) {
    User.find(filter, callback); 
}

function findEntities(filter, callback) {
    Entity.find(filter, callback); 
}


