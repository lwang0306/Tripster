var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function send_invitation(req, res) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			for (var i = 0; i < req.session.friends.length; i++) {
				if (req.body['invite' + i] != undefined) {
					var query = create_insert_invite_query(req.session.friends[i].USERNAME2, 
						req.session.tripid);
					connection.execute(query, [], function(err, results) {
						if (err) {
							console.log(err);
						}
					});
					req.session.friends.splice(i ,1);
					res.render('invite.jade', {
						friends: req.session.friends,
						message2: 'Invitation Sent!'
					});
				}
			}
		}
	});
}

function create_insert_invite_query(username, tripid) {
	var query = "INSERT INTO INVITE VALUES ('" + username + 
		"', '" + tripid + "', 'pending')";
	return query;
}

exports.do_work = function(req, res){
	send_invitation(req, res);
};