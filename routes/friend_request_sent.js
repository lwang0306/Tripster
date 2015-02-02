var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

/////
// check the relationship status between two users, and respond to add friend request
//
// targetUsername = the target username to sent request to
function add_friend_req_db(req, res, targetUsername, username) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute("SELECT DISTINCT * FROM FRIENDS WHERE (USERNAME1='" + username + "' AND USERNAME2='" 
    		+ targetUsername + "') OR (USERNAME1='" + targetUsername + "' AND USERNAME2='" + username + "')",
    		[],
    		function(err, existing) {
    		if ( err ) {
    			console.log(err);
    		} else {
    			console.log(existing);
    			if (existing.length == 0) {
    				insert_one_request(username, targetUsername);
    				res.render("friend_request_sent.jade",
    					{message: "Your request has been sent. Please wait for " + targetUsername + "'s response..."});
    			} else if (existing.length == 2 && existing[0].STATUS == 'accepted' && existing[1].STATUS == 'accepted') {
    				res.render("friend_request_sent.jade",
    					{message: "You and " + targetUsername + "are already friends! Checkout his/her homepage:",
                        alreadyFriends: true,
                        friend: targetUsername});
    			} else if (existing.length == 1 && existing[0].STATUS != 'denied') {
    				if (existing[0].USERNAME1 == username && existing[0].STATUS == 'pending') {
    					res.render("friend_request_sent.jade",
    						{message: "You already sent " + targetUsername + " a friend request. Please wait for response..."});
    				} else if (existing[0].USERNAME1 == username && existing[0].STATUS == 'denied') {
                        res.render("friend_request_sent.jade",
                            {message: "You already sent " + targetUsername + " a friend request. Please checkout his/her response at Notification Center."});
                    }
                      else {
    					res.render("friend_request_sent.jade",
    						{message: targetUsername + " already sent you a friend request. To respond:",
    						hadRequestFromTarget: true,
                            requester: targetUsername});
    				}
    			} else {
                    insert_one_request(username, targetUsername);
                    res.render("friend_request_sent.jade",
                        {message: "Your request has been sent. Please wait for " + targetUsername + "'s response..."});
                }
    		}
    	}); // end of connection.execute
    }
}); // end of orocal.connect
}


////
// add a new record of (username, targetUsername, pending) to database
//
// username = the user who send friend request
// targetUsername = the user who receive friend request
function insert_one_request(username, targetUsername) {
	var query = "INSERT INTO FRIENDS VALUES ('" + username + "', '" 
		+ targetUsername + "', 'pending')";
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(query, [], function(err, results) {
    		if (err) {
    			console.log(err);
    		} else {
    			connection.close();
    		}
    	}); // end of connection.execute
    }
});  // end of oracle.connect
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
	add_friend_req_db(req, res, req.query.targetUsername, username);
};
