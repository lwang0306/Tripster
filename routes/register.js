var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, username, email, password, name, interests, affiliation, gender, portrait) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	// selecting rows
    	connection.execute("SELECT * FROM USERS WHERE USERNAME=" + "'"+ username + "'"
    		+ " OR EMAIL='" + email + "'", [], function(err, results) {
    			if (err) {
    				console.log(err);
    			} else {
    				connection.close();
    				if (results.length > 0) { // User already exists
    					res.render('signup.jade', {
    						message: 'Username/email already exists! Please pick a different name!'
    					})
    				} else { // User doesn't not exists
    					if (username.length == 0 || email.length == 0 || password.length == 0) { // username/password can not be empty
    						res.render('signup.jade', {
    						message: 'All fields with a * must be filled!'
    						});
    					} else {
    						// create a new record in database
    						insert_db(req, res, username, email, password, name, gender, affiliation, interests, portrait);
 							res.render('register.jade', {
 								message: 'Hi ' + name + ', Welcome on board :)'
 							});
    					}
    				}
    			}
    		});
    	}
    });
}

function insert_db(req, res, username, email, password, name, gender, affiliation, interests, portrait) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	var bcrypt = require('bcrypt')
	  	var salt = bcrypt.genSaltSync(10);
		// Hash the password with the salt
		var hash = bcrypt.hashSync(password, salt) + "";
		//console.log(bcrypt.compareSync(password, hash)); // true);
    	var query = construct_query(username, email, hash, name, gender, affiliation, interests, portrait);
    	connection.execute(query, [], function(err, results) {
    		if (err) {
    			console.log(err);
    		} else {
    			connection.close();
    		}
    	});
      }
	});
}

function construct_query(username, email, hash, name, gender, affiliation, interests, portrait) {
	var query = "INSERT INTO USERS VALUES ('" + username + "', '" 
		+ email + "', '" + hash + "', '" + name + "', '" + gender 
		+ "', '" + affiliation + "', '" + interests + "', '" + portrait + "')";
	return query;
}

exports.do_work = function(req, res) {
	query_db(req, res, req.body.username, req.body.email, req.body.password, req.body.name,
		req.body.gender, req.body.affiliation, req.body.interests, req.body.portrait);
}