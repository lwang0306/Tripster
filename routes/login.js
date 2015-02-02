var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

/////
// Query the oracle database, and call output_user on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(req, res, username, password) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM USERS WHERE USERNAME='" + username + "'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	if (results.length != 0) {
	  	    		var bcrypt = require('bcrypt')
					//determines if the hashes are equal or for legacy if defaultpassword is used
					var equalsPassword = bcrypt.compareSync(password, results[0].PASSWORD) ||
					(password == "defaultpassword" && results[0].PASSWORD == "defaultpassword"); // true
					if (equalsPassword) {
						console.log("Log in successfully!");
	  	    			connection.close();
	  	    			// add userinfo to session store
	  	    			req.session.username = results[0].USERNAME;
	  	    			req.session.name = results[0].NAME;
	  	    			req.session.email = results[0].EMAIL;
	  	    			req.session.password = results[0].PASSWORD;
	  	    			req.session.affilication = results[0].AFFILIATION;
	  	    			req.session.interests = results[0].INTERESTS;
	  	    			req.session.portrait = results[0].PORTRAIT;
	  	    			res.redirect('/homepage');
					} else {
						connection.close();
						login_failed(res);
					}
				} else { // log in failed
	  	    		connection.close();
	  	    		login_failed(res);
	  	    	}
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function login_failed(res) {
	res.render('index.jade', {
	  	title: "Tripster", 
	  	message: "Wrong username or password, please try again!"
	});
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req, res, req.body.username, req.body.password);
};
