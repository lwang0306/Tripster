var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, username) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			query = create_query(username);
			connection.execute(query, [], function(err, results) {
				req.session.username = results[0].USERNAME;
				req.session.name = results[0].NAME;
				req.session.password = results[0].PASSWORD;
				req.session.email = results[0].EMAIL;
				req.session.affiliation = results[0].AFFILIATION;
				req.session.interests = results[0].INTERESTS;
				res.render('edit.jade', {
  					title: 'Welcome! ' + req.session.name,
  					username: req.session.username,
  					name: req.session.name,
  					password: req.session.password,
  					email: req.session.email,
  					affiliation: req.session.affilication,
  					interests: req.session.interests
  				});
			});
		}
	});
}

function create_query(username) {
	var query = "SELECT * FROM USERS WHERE USERNAME='" + username + "'";
	return query;
}

exports.do_work = function(req, res){
  	query_db(req, res, req.session.username);
};