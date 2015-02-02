var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

/////
// Accept friend request and update database
//
// res = HTTP result object sent back to the client
// name = Name to query for
function accept(req, res, requester, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {    	
    	connection.execute("SELECT DISTINCT * FROM FRIENDS WHERE USERNAME1='" + username + "' AND USERNAME2='" + requester + "'",
    		[],
    		function(err, existing) {
    		if ( err ) {
    			console.log(err);
    		} else {
    			// if the user received request from requester but did not send request to the requester
    			// add a record to complete the double-way request
    			if (existing.length == 0) {
    				insert_one_accept(username, requester);
    			} else if (existing.length == 1 && existing[0].STATUS != 'accepted') {
                    change_status(username, requester);  
                }
    		}
    	});
    	change_status(requester, username);
    }
});
}

////
// add a new record of (username, targetUsername, accepted) to database
//
// username = the current user
// targetUsername = another user
function insert_one_accept(username, targetUsername) {
	var query = "INSERT INTO FRIENDS VALUES ('" + username + "', '" 
		+ targetUsername + "', 'accepted')";
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(query, [], function(err, results) {
    		if (err) {
    			console.log(err);
    		}
    	}); // end of connection.execute
    }
});  // end of oracle.connect
}


////
// change the status of friends to accepted
//
// username1 = the one user
// username2 = another user
function change_status(username1, username2) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute("UPDATE FRIENDS SET STATUS='accepted' WHERE USERNAME1='" + username1 + "' AND USERNAME2='" 
    		+ username2 + "'",
    	[],
    	function(err, results) {
    		if (err) {
    			console.log(err);
    		}
    	});
    }
});
}



/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
	accept(req, res, req.query.requester, username);
	// reaching here, double-way request existing in database, change the status to accepted
    // change_status(req.query.requester, username);
	res.render('accept_friend_req.jade',
		{message: "Congratulations! You have a new friend:",
        requester: req.query.requester});
};
