var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_inviters(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_invitation_query(username), 
    		[], function(err, inviters) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.inviters = inviters;
    				query_invitees(req, res, username);
    			}
    		});
    }
});
}

function query_invitees(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_invitee_query(username),
    		[], function(err, invitees) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.invitees = invitees;
    				query_requests(req, res, username);
    			}
    		});
    }
});
}

function query_requests(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_request_query(username),
    		[], function(err, requests) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.requests = requests;
    				query_requested(req, res, username);
    			}
    		});
    }
});
}

function query_requested(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_requested_query(username),
    		[], function(err, requested) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.requested = requested;
    				query_friend_requested(req, res, username);
    			}
    		});
    }
});
}

function query_friend_requested(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_query_friend_requested(username),
    		[], function(err, frequested) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.frequested = frequested;
    				query_friend_request(req, res, username);
    			}
    		});
    }
});
}

function query_friend_request(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_query_friend_request(username),
    		[], function(err, frequests) {
    			if (err) {
    				console.log(err);
    			} else {
    				req.session.frequests = frequests;
    				res.render('notification.jade', {
    					title: "Notification Center",
    					inviters: req.session.inviters,
    					invitees: req.session.invitees,
    					requests: req.session.requests,
    					requested: req.session.requested,
    					frequested: req.session.frequested,
    					frequests: req.session.frequests,
    				});
    			}
    		});
    }
});
}

function create_invitation_query(username) {
	var query = "SELECT C.USERNAME, T.TIME, T.ID, I.STATUS, T.NAME FROM CREATES C " +
    		"INNER JOIN INVITE I ON C.TRIPID = I.TRIPID " +
    		"INNER JOIN TRIPS T ON T.ID = C.TRIPID " + 
    		"WHERE I.STATUS = 'pending' AND I.USERNAME = '" + username + "'";
    return query;
}

function create_invitee_query(username) {
	var query = "SELECT I.USERNAME, T.TIME, T.ID, T.NAME, I.STATUS FROM CREATES C " +
    		"INNER JOIN INVITE I ON C.TRIPID = I.TRIPID " +
    		"INNER JOIN TRIPS T ON T.ID = C.TRIPID " + 
    		"WHERE I.STATUS != 'pending' AND C.USERNAME = '" + username + "'";
    return query;
}

function create_request_query(username) {
	var query = "SELECT C.USERNAME, T.TIME, T.ID, T.NAME, R.STATUS FROM CREATES C " +
			"INNER JOIN REQUEST R ON R.TRIPID = C.TRIPID " +
			"INNER JOIN TRIPS T ON T.ID = C.TRIPID " +
			"WHERE R.STATUS != 'pending' AND R.USERNAME = '" + username + "'";
	return query;
}

function create_requested_query(username) {
	var query = "SELECT R.USERNAME, T.TIME, T.ID, T.NAME FROM CREATES C " +
			"INNER JOIN REQUEST R ON R.TRIPID = C.TRIPID " +
			"INNER JOIN TRIPS T ON T.ID = C.TRIPID " +
			"WHERE R.STATUS = 'pending' AND C.USERNAME = '" + username + "'";
	return query;
}

function create_query_friend_requested(username) {
	var query = "SELECT F.USERNAME1 FROM FRIENDS F " +
			"WHERE STATUS = 'pending' AND USERNAME2 = '" + username + "'";
	return query;
}

function create_query_friend_request(username) {
	var query = "SELECT F.USERNAME2, F.STATUS FROM FRIENDS F " +
			"WHERE STATUS = 'denied' AND USERNAME1 = '" + username + "'";
	return query;
}

exports.do_work = function(req, res){
	query_inviters(req, res, req.session.username);
};