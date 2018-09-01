const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/rhdb');


function printBDError (err, result) {
  if (err) throw err;
  console.log(result);
}

function cleanAll() {
  // #TODO
}

function initializeRoot() {	
  const userSchema = mongoose.Schema({
    login: { type: String, trim: true, index: true },
    password: String,
    locked: Boolean
  });

  const User = db.model('users', userSchema);	
  const value = new User({ login: "admin", password: "pepe", locked: false });
  value.save(printBDError);
}

function initializeSampleData() {	
  const entitySchema = mongoose.Schema({
    name: { type: String, trim: true, index: true },
    tel: { type: String, trim: true },
    data: String,
    tags: { type: String, trim: true },
    comment: { type: String, trim: true }
    });

  const Entity = db.model('entities', entitySchema);	
  const value = new Entity({ name: "Alberto", password: "1144449999", data: 'raw pdf', tags: { "C#" }, comment: "Really lame" });
  value.save(printBDError);
}

cleanAll();
initializeRoot();
initializeSampleData();


