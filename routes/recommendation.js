var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, username) {
	var sql = "SELECT DISTINCT T.NAME " +
				"FROM FRIENDS F " +
				"INNER JOIN ONTRIP OT ON F.USERNAME2 = OT.USERNAME " +
				"INNER JOIN TRIPS T ON T.ID = OT.TRIPID " +
				"WHERE F.USERNAME1 = '" + username + "' AND T.TIME = 'future' " +
				"MINUS " +
				"SELECT DISTINCT T.NAME " +
				"FROM TRIPS T " +
				"INNER JOIN ONTRIP OT ON T.ID = OT.TRIPID " +
				"WHERE OT.USERNAME = '" + username + "' AND T.TIME = 'future'";

	// var sql_status = "SELECT R.STATUS " +
	// 				"FROM TRIPS T " +
	// 				"INNER JOIN REQUEST R ON R.TRIPID = T.ID " +
	// 				"WHERE T.NAME = '" + tripname + "' AND R.USERNAME = '" + username + "' " +
	// 				"UNION " +
	// 				"SELECT I.STATUS " +
	// 				"FROM TRIPS T " +
	// 				"INNER JOIN INVITE I ON I.TRIPID = T.ID " +
	// 				"WHERE T.NAME = '" + tripname + "' AND I.USERNAME = '" + username + "' ";
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute(sql, [], function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
			  	console.log(results);
			  	connection.close();
			  	res.render('recommendation.jade', { 
			  		title: 'Recommendation', 
			  		results: results
			  	});
	  	    }
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

/////
// check the relationship status between two users, and respond to add friend request
//
// targetUsername = the target username to sent request to
function show_friends_recommendation(req, res, username) {

	var sql = "SELECT DISTINCT T.NAME " +
				"FROM FRIENDS F " +
				"INNER JOIN ONTRIP OT ON F.USERNAME2 = OT.USERNAME " +
				"INNER JOIN TRIPS T ON T.ID = OT.TRIPID " +
				"WHERE F.USERNAME1 = '" + username + "' AND T.TIME = 'future' " +
				"MINUS " +
				"SELECT DISTINCT T.NAME " +
				"FROM TRIPS T " +
				"INNER JOIN ONTRIP OT ON T.ID = OT.TRIPID " +
				"WHERE OT.USERNAME = '" + username + "' AND T.TIME = 'future'";

	oracle.connect(connectData, function(err, connection) {
        if ( err ) {
         console.log(err);
     } else {
        var query = "SELECT DISTINCT F2.USERNAME2 AS USERNAME FROM FRIENDS F1, FRIENDS F2 WHERE F1.USERNAME1 = '"
        + username + "' AND F1.STATUS = 'accepted' AND F1.USERNAME2 = F2.USERNAME1 AND F2.STATUS = 'accepted' AND F2.USERNAME2 <> '"
        + username + "' AND ROWNUM < 101";
        connection.execute(query,
          [],
          function(err, friendsfriend) {
              if ( err ) {
               console.log(err);
           } else {
               console.log(friendsfriend);
               oracle.connect(connectData, function(err, connection) {
                if ( err ) {
                    console.log(err);
                } else {
                    var query = "SELECT U2.USERNAME AS USERNAME FROM USERS U1, USERS U2 WHERE U1.USERNAME = '"
                    + username + "' AND U1.INTERESTS = U2.INTERESTS AND U2.USERNAME <> '" + username + "'";
                    connection.execute(query,
                        [],
                        function(err, sameinterests) {
                            if ( err ) {
                                console.log(err);
                            } else {
                                console.log(sameinterests);

                                connection.execute(sql, [], function(err, results) {
	  	    						if ( err ) {
	  	    							console.log(err);
	  	    						} else {
			  							console.log(results);
			  							connection.close();
			  							res.render('recommendation.jade', { 
			  								title: 'Recommendation', 
			  								results: results,
			  								friendsfriend: friendsfriend,
			  								sameinterests: sameinterests
			  						});
	  	    }
	  	}); // end connection.execute
                            }
        }); // end of connection.execute
                }
}); // end of orocal.connect

}
    	}); // end of connection.execute
}
}); // end of orocal.connect
}

exports.do_work = function(req, res){
	var username = req.session.username;
	show_friends_recommendation(req, res, username);
};