var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

var BingSearch=require('bing-search');
var bing=new BingSearch({
    user: '...',
    password: '...'
})

// var bing = require('binger')
// var b = bing({appId:"o/qdig9gOOIwWLaOcY5Z9AunJJjwCjdYBoO3BTSxFcg"})

function query_db(req, res, tripname, username, time) {
	var sql_status = "SELECT R.STATUS " +
					"FROM TRIPS T " +
					"INNER JOIN REQUEST R ON R.TRIPID = T.ID " +
					"WHERE T.NAME = '" + tripname + "' AND R.USERNAME = '" + username + "' " +
					"UNION " +
					"SELECT I.STATUS " +
					"FROM TRIPS T " +
					"INNER JOIN INVITE I ON I.TRIPID = T.ID " +
					"WHERE T.NAME = '" + tripname + "' AND I.USERNAME = '" + username + "' ";

	var sql1 = "SELECT T.NAME, T.FEATURE, T.ID, RT.SCORE, P.LOCATIONNAME, C.USERNAME AS CREATORNAME " +		// trip feature
				"FROM TRIPS T " +
				"INNER JOIN ( " +
				"SELECT TRIPID, AVG(SCORE) AS SCORE " +
				"FROM RATETRIP " +
				"GROUP BY TRIPID ) RT ON T.ID = RT.TRIPID " +
				"INNER JOIN PLANNED P ON P.TRIPID = T.ID " +
				"INNER JOIN CREATES C ON C.TRIPID = T.ID " +
				"WHERE T.NAME = '" + tripname + "'";

	var sql2 = "SELECT I.USERNAME AS FRIEND " +							// search trip attendents
				"FROM INVITE I " +
				"INNER JOIN TRIPS T ON T.ID = I.TRIPID " +
				"WHERE I.STATUS = 'accepted' AND T.NAME = '" + tripname + "' " +
				"AND I.USERNAME != '" + username + "' " +
				"UNION " +
				"SELECT R.USERNAME AS FRIEND " +
				"FROM REQUEST R " +
				"INNER JOIN TRIPS T ON T.ID = R.TRIPID " +
				"WHERE R.STATUS = 'accepted' AND T.NAME = '" + tripname + "' " +
				"AND R.USERNAME != '" + username + "'";

	var sql3 = "SELECT A.NAME AS ALBUMNAME, A.ID AS ALBUMID  " +	// search trip albums
				"FROM TRIPS T " +
				"INNER JOIN TRIPALBUM TA ON T.ID = TA.TRIPID " +
				"INNER JOIN ALBUMS A ON TA.ALBUMID = A.ID " +
				"WHERE T.NAME = '" + tripname + "'";

	var sql4 = "SELECT COUNT(*)	AS STATUS " +									// search rate status
				"FROM TRIPS T " +
				"INNER JOIN RATETRIP RT ON T.ID = RT.TRIPID " +
				"WHERE T.NAME = '" + tripname + "' AND RT.USERNAME = '" + username + "'";

	var sql5 = "SELECT COUNT(*) AS CSTATUS " + 						// search if the user creates the trip
				"FROM CREATES C " +										// 1 means creator, 0 means not creator
				"INNER JOIN TRIPS T ON C.TRIPID = T.ID " +
				"WHERE C.USERNAME = '" + username + "' AND T.NAME = '" + tripname + "'";

  	oracle.connect(connectData, function(err, connection) {
  		if ( err ) {
	    	console.log(err);
	    } else {
		  	connection.execute(sql_status, [], function(err, results) {			// search trip status
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if (results.length != 0)
		  	    		var status = results[0].STATUS;
		  	    	else
		  	    		var status = undefined;
		  	    	// console.log(status);
		  			connection.execute(sql1, [], function(err, results1) {			// search trip information
				  	    if ( err ) {
				  	    	console.log(err);
				  	    } else {
				  	    	console.log(results1);
				  	    	connection.execute(sql2, [], function(err, results2) {		// search friends
				  	    		if ( err ) {
				  	    			console.log(err);
				  	    		} else {
				  	    			connection.execute(sql3, [], function(err, results3) {			// search albums
				  	    				if ( err ) {
				  	    					console.log(err);
				  	    				} else {
				  	    					connection.execute(sql5, [], function(err, results5) {
				  	    						if ( err ) {
				  	    							console.log(err);
				  	    						} else {
				  	    							req.session.tripid = results1[0].ID;
						  	    					if (status == 'accepted') {
							  	    					connection.execute(sql4, [], function(err, results4) {
							  	    						if ( err ) {
							  	    							console.log(err);
							  	    						} else {
							  	    							connection.close();					
							  	    							render(res, tripname, results1, results2, results3, results5[0].CSTATUS, results4[0].STATUS);
													  		}
										  				});
										  			} else if (status == 'pending') {
										  				connection.close();
										  				render(res, tripname, results1, results2, results3, results5[0].CSTATUS, 2);
										  			} else {								// status == rejected/undefined
										  				connection.close();			
										  				render(res, tripname, results1, results2, results3, results5[0].CSTATUS, 3);
										  			}	
										  		}
										  	})			
				  	    				}
				  	    			})
				  	    		}
							})
						}
					})
				}
		  	}); // end connection.execute
		}
    }); // end oracle.connect
}

function render(res, tripname, results1, results2, results3, cstatus, rstatus) {
	// console.log(results1);
	// console.log(results2);
	console.log("cstatus = " + cstatus);
	res.render('atrip.jade', { 
		title: tripname,
		name: tripname,
		tripid: results1[0].ID,
		creator: results1[0].CREATORNAME,
		location: results1[0].LOCATIONNAME,
		feature: results1[0].FEATURE,
		score: results1[0].SCORE,
		friends: results2, 
		albums: results3,
		cstatus: cstatus,
		rstatus: rstatus
	});
}

exports.do_work = function(req, res){
	var tripname = req.query.tripname;
	var username = req.session.username;
	var time = req.query.time;


	query_db(req, res, tripname, username, time);
	// b.search("MooTools", function(error, response, body){
	// 	console.log(body.SearchResponse.Web.Results[0]) 
	// },{limit: 30})

	bing.search({
	    query: 'query'
	}).then(function(res){
	    // res is a json object, containing 2 fields:
	    // * results: (the array of results)
	    // * __next: the url to the next page
	    console.log(res.results[0]);
	}, function(err){
		console.log(err);
	})
};