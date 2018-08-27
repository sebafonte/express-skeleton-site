const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/rhdb');


function printBDError (err, result) {
      if (err) throw err;
      console.log(result);
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


initializeRoot();


