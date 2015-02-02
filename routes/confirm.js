var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else { 
			update_invitation(req, res, connection);
			delete_invitation(req, res, connection);
			update_request(req, res, connection);
			delete_request(req, res, connection);
			update_frequest(req, res, connection);
			delete_frequest(req, res, connection);
		}
	});
}

function update_invitation(req, res, connection) {
	// check if any there is any update to trip invitation
	for (var i = 0; i < req.session.inviters.length; i++) {
		if (req.body['invitation' + i] != undefined) { // update new status to INVITE
			var query = create_update_invitation_query(req.session.username, 
				req.session.inviters[i].ID, req.body['invitation' + i]);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				} 
			});
			// then check if accepted or not
			if (req.body['invitation' + i] == 'accepted') { // if accepted, update ONTRIP table					
				connection.execute(create_insert_ontrip_query(req.session.username,
					req.session.inviters[i].ID), [], function(err, results) {
					if (err) {
						console.log(err);
					}
				});
			}
			req.session.inviters.splice(i, 1);
			render_page(req, res);
		}
	}
}

function delete_invitation(req, res, connection) {
	for (var i = 0; i < req.session.invitees.length; i++) {
		if (req.body['invmes' + i] != undefined) {
			var query = create_delete_invitation_query(req.session.invitees[i].USERNAME, 
				req.session.invitees[i].ID, req.session.invitees[i].STATUS);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				}
			});
			req.session.invitees.splice(i, 1);
			render_page(req, res);
		}
	}
}

function update_request(req, res, connection) {
	// check if any there is any update to trip request
	for (var i = 0; i < req.session.requested.length; i++) {
		if (req.body['trequested' + i] != undefined) {
			var query = create_update_request_query(req.session.requested[i].USERNAME, 
				req.session.requested[i].ID, req.body['trequested' + i]);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				}
			});
			// then check if accepted or not
			if (req.body['trequested' + i] == 'accepted') { // if accepted, update ONTRIP table					
				connection.execute(create_insert_ontrip_query(req.session.requested[i].USERNAME,
					req.session.requested[i].ID), [], function(err, results) {
					if (err) {
						console.log(err);
					}
				});
			}
			req.session.requested.splice(i, 1);
			render_page(req, res);
		}
	}
}

function delete_request(req, res, connection) {
	for (var i = 0; i < req.session.requests.length; i++) {
		if (req.body['trequest' + i] != undefined) {
			var query = create_delete_request_query(req.session.username, 
				req.session.requests[i].ID, req.session.requests[i].STATUS);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				}
			});
			req.session.requests.splice(i, 1);
			render_page(req, res);
		}
	}
}

function update_frequest(req, res, connection) {
	// check if any there is any update to trip request
	for (var i = 0; i < req.session.frequested.length; i++) {
		if (req.body['frequested' + i] != undefined) {
			var query = create_update_frequest_query(req.session.frequested[i].USERNAME1, 
				req.session.username, req.body['frequested' + i]);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				}
			});
			// then check if accepted or not
			if (req.body['frequested' + i] == 'accepted') { // if accepted, update ONTRIP table
				var query = create_insert_friends_query(req.session.username, 
					req.session.frequested[i].USERNAME1, 'accepted');
				connection.execute(query, [], function(err, results) {
					if (err) {
						console.log(err);
					}
				});
			}
			req.session.frequested.splice(i, 1);
			render_page(req, res);
		}
	}
}

function delete_frequest(req, res, connection) {
	for (var i = 0; i < req.session.frequests.length; i++) {
		console.log(req.body['frequest' + i]);
		if (req.body['frequest' + i] != undefined) {
			var query = create_delete_frequest_query(req.session.username, 
				req.session.frequests[i].USERNAME2, "denied");
			console.log(query);
			connection.execute(query, [], function(err, results) {
				if (err) {
					console.log(err);
				}
			});
			req.session.frequests.splice(i, 1);
			render_page(req, res);
		}
	}
}

function create_update_invitation_query(username, tripid, status) {
	var query = "UPDATE INVITE SET STATUS='" + status + "' " +
			"WHERE USERNAME='" + username + "' AND TRIPID=" + tripid;
	return query;
}

function create_insert_ontrip_query(username, tripid) {
	var query = "INSERT INTO ONTRIP VALUES ('" + tripid + "', '" + username + "')";
	return query;
}

function create_delete_invitation_query(username, tripid, status) {
	var query = "DELETE FROM INVITE " +
				"WHERE USERNAME='" + username + "' AND TRIPID='" + tripid 
				+ "' AND STATUS='" + status + "'";
	return query;
}

function create_update_request_query(username, tripid, status) {
	var query = "UPDATE REQUEST SET STATUS='" + status + "' " +
			"WHERE USERNAME='" + username + "' AND TRIPID=" + tripid;
	return query;
}

function create_delete_request_query(username, tripid, status) {
	var query = "DELETE FROM REQUEST " +
				"WHERE USERNAME='" + username + "' AND TRIPID='" + tripid 
				+ "' AND STATUS='" + status + "'";
	return query;
}

function create_update_frequest_query(username1, username2, status) {
	var query = "UPDATE FRIENDS SET STATUS='" + status + "' " +
			"WHERE USERNAME1='" + username1 + "' AND USERNAME2='" + username2 + "'";
	return query;
}

function create_insert_friends_query(username1, username2, status) {
	var query = "INSERT INTO FRIENDS VALUES ('" + username1 + "', '" + username2  + "', '" + status + "')";
	return query;
}

function create_delete_frequest_query(username1, username2, status) {
	var query = "DELETE FROM FRIENDS " +
				"WHERE USERNAME1='" + username1 + "' AND USERNAME2='" + username2 
				+ "' AND STATUS='" + status + "'";
	return query;
}

function render_page(req, res) {
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


exports.do_work = function(req, res) {
	query_db(req, res);
};