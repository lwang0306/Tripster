var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, tripname, feature, privacyflag, location) {
	var username = req.session.username;
	if (tripname.length != 0 && privacyflag != 0) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				var sql1 = "SELECT MAX(ID) AS ID FROM TRIPS";
				connection.execute(sql1, [], function(err, results) {
					if (err) {
						console.log(err);
					} else {
						var tripid = results[0].ID + 1;
						var sql2 = "INSERT INTO TRIPS (ID, NAME, FEATURE, PRIVACYFLAG, TIME) " +
									"VALUES (" + tripid + ", '" + 
									tripname + "', '" + feature + "', '" + privacyflag + "', 'future')";
						connection.execute(sql2, [], function(err, results) {
							if (err) {
								console.log(err);
							} else {
								// console.log("trip created");
								var sql3 = "INSERT INTO CREATES VALUES ('" + username + "', " + tripid + ")";
								connection.execute(sql3, [], function(err, results) {
									if (err) {
										console.log(err);
									} else {
										var sql4 = "INSERT INTO ONTRIP VALUES ('" + tripid + "', '" + username + "')";
										connection.execute(sql4, [], function(err, results) {
											if (err) {
												console.log(err);
											} else {
												var sql5 = "INSERT INTO PLANNED VALUES ('" + tripid + "', '" + location + "')";
												connection.execute(sql5, [], function(err, results) {
													if (err) {
														console.log(err);
													} else {
														connection.close();
														res.render('newtrip.jade', {
															tripname: tripname
														});
													}
												});
											}
										});
									}
								})
							}
						})
					}
				})
			}
		});
	} else if (tripname.length == 0) {						// tripname is empty
		res.render('createtrip.jade', {
  			message: 'Trip name can not be left blank!'
  		});
  	} else {												// privacyflag is empty
		res.render('createtrip.jade', {
  			message: 'Privacy flag can not be left blank!' 	
  		});	
  	}
}

exports.do_work = function(req, res){
  	query_db(req, res, req.body.tripname, req.body.feature, req.body.privacyflag, req.body.location);
};