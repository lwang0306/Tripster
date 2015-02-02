var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

/////
// Deny friend request and update database
//
// res = HTTP result object sent back to the client
// name = Name to query for
function deny(req, res, requester, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {    	
    	change_status(requester, username);
    }
});
}

////
// change the status of friends to denied
//
// username1 = the one user
// username2 = another user
function change_status(username1, username2) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute("UPDATE FRIENDS SET STATUS='denied' WHERE USERNAME1='" + username1 + "' AND USERNAME2='" 
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
	deny(req, res, req.query.requester, username);
	// reaching here, double-way request existing in database, change the status to accepted
    // change_status(req.query.requester, username);
	res.render('accept_friend_req.jade',
		{message: "You declined a friend request from:",
        requester: req.query.requester});
};
