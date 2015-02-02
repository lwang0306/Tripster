var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, sql1, sql2) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute(sql1, [], function(err, results1) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.execute(sql2, [], function(err, results2) {
	  	    		if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	// console.log(results1);
			  	    	// console.log(results2);
			  	    	connection.close();
			  	    	res.render('trip.jade', { 
			  				title: 'My trips',
			  				results1: results1, 
			  				results2: results2
		  				});
	  	    		}
				})
			}
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

exports.do_work = function(req, res){
	var username = req.session.username;
	// console.log(username);
	var sql1 = "SELECT T.NAME " +							// past trips
				"FROM TRIPS T " +
				"INNER JOIN ONTRIP OT ON T.ID = OT.TRIPID " +
				"WHERE T.TIME = 'past' AND OT.USERNAME = '" + username + "'";

	var sql2 = "SELECT T.NAME " +							// future trips
				"FROM TRIPS T " +
				"INNER JOIN ONTRIP OT ON T.ID = OT.TRIPID " +
				"WHERE T.TIME = 'future' AND OT.USERNAME = '" + username + "'";

	query_db(req, res, sql1, sql2);
};