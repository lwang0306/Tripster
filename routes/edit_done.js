var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function insert_db(req, res, email, password, name, affiliation, interests) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	var hash;
    	if (password != req.session.password) { 
    		var bcrypt = require('bcrypt')
	  		var salt = bcrypt.genSaltSync(10);
			// Hash the password with the salt
			hash = bcrypt.hashSync(password, salt) + "";
    	} else { // if password hasn't been changed, we don't need to encrypt it again
    		hash = password;
    	}
    	
    	var query = construct_query(req, email, hash, name, affiliation, interests);
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

function construct_query(req, email, hash, name, affiliation, interests) {
	var query = "UPDATE USERS SET EMAIL='" + email + "', PASSWORD='" + hash
	+ "', NAME='" + name + "', AFFILIATION='" + affiliation + "', INTERESTS='" + interests 
	+ "' WHERE USERNAME='" + req.session.username + "'";
	return query;
}

exports.do_work = function(req, res) {
	insert_db(req, res, req.body.email, req.body.password,
	 req.body.name, req.body.affiliation, req.body.interests);
  	res.render('edit_done.jade', { 
	  	title: 'Tripster',
	  	message: 'You profile has been changed successfully!' 
  });
};