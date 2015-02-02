var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, username, tripid) {
	var sql = "INSERT INTO REQUEST VALUES ('" + username + "', '" + tripid + "', 'pending')";
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute(sql, [], function(err) {
				if (err) {
					console.log(err);
				} else {
					connection.close();
					res.render('applytrip.jade', { 
						title: "Request sent."
					});
				}
			});
		}
	})
}

exports.do_work = function(req, res){
	var username = req.session.username;
	var tripid = req.query.tripid;
	// console.log(tripname);

	query_db(req, res, username, tripid);


}