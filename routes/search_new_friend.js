var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}


/////
// Query the oracle database, find the new friend for the user
//
// res = HTTP result object sent back to the client
// newfriend = username of the new friend to query for
function query_db(req, res, newfriend, username) {
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			oracle.connect(connectData, function(err, connection) {
				if ( err ) {
					console.log(err);
				} else {
	  	// selecting rows
	  	connection.execute("SELECT U.USERNAME AS USERNAME FROM USERS U WHERE U.USERNAME <> '" + username + "'", 
	  		[], 
	  		function(err, allOtherUsers) {
	  			if ( err ) {
	  				console.log(err);
	  			} else {
	  				connection.execute("SELECT F.USERNAME2 AS USERNAME FROM FRIENDS F WHERE F.USERNAME1 = '" 
	  					+ username + "'  AND F.STATUS = 'accepted'",
	  					[],
	  					function(err, friends) {
	  						if ( err ) {
	  							console.log(err);
	  						} else {
	  							connection.close();
	  							if (allOtherUsers.length != 0 && results_contains(allOtherUsers,newfriend) && !results_contains(friends,newfriend)) {
	  								console.log("Find matching new friend!");
	  								res.render('search_new_friend.jade', {
	  									title: 'Search for New Friend',
	  									message: "1 matching:",
	  									result: newfriend,
	  									showButton: true
	  								}); 	    		
	  							} else if (newfriend == username) {
	  								console.log("Searching for the user him/herself!");
	  								res.render('search_new_friend.jade', {
	  									title: 'Search for New Friend',
	  									message: "Oops, you're searching yourself."
	  								}); 
	  							} else if (results_contains(friends,newfriend)) {
	  								console.log("Searching for his/her own friend!");
	  								res.render('search_new_friend.jade', {
	  									title: 'Search for New Friend',
	  									message: "You're already friends! Checkout his/her homepage:",
	  									alreadyFriends: true,
	  									friend: newfriend
	  								}); 
	  							} else {
	  								console.log("This user does not have any friend.");
	  								res.render('search_new_friend.jade', {
	  									title: 'Search for New Friend',
	  									message: "Sorry, we could not find matching users."
	  								});
	  							}
	  						}
	  					});
				}
	  		}); // end inner connection.execute
		}
  	}); // end outer connection.execute
	}
	});// end oracle.connect
}

/////
// Given a set of query results, check if it contains the username
//
// results = the query results
// username = username to search
function results_contains(results,username) {
	var i;
	for (i = 0; i < results.length; i++) {
		if (results[i].USERNAME == username)
			return true;
	}
	return false;
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	var username = req.session.username;
	query_db(req, res, req.query.newfriend, username);
};
