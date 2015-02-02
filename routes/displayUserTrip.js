/**
 * displayUserTrip.js render create_album.jade file to display create new album form 
 */
var oracle =  require("oracle");
// database connection string
var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

// Query the oracle database, and call output_user on the results
//
// res = HTTP result object sent back to the client
// username = req.session.username
function query_db(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	// console.log(username + ", ", password);
		  	// selecting rows
		  	connection.execute(construct_query_get_tripName(username), 
		  	    [], function(err, results) {
		  	    if (err) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log(results);
		  	    	if (results.length != 0) {
		  	            // below method is to capture the query results in results that passed to func output_result to be passed to jade view
		  	    		output_trip(res, username, results);
		  	    		connection.close();
		  	    	} else {
		  	    		connection.close();
		  	    		console.log("Sorry, you need to create a trip first to create an album.");
		  	    		// res.redirect('/createTrip');
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    } // end else
    }); // end oracle.connect
}

/////
// Output query result to results, render create_album.jade page 
//
// res = HTTP result object sent back to the client
// name = username passed in (req.session.username)
// results = List object of query results, can be passed to create_album.jade to display
function output_trip(res,name,results) {
	res.render('create_album.jade',
		   { title: "Congratulations " + name + " , now you can create a new album",
		     results: results } // results will be passed to the create_album page to display trips 
	);
}


function construct_query_get_tripName(username) {
	var query = "SELECT T.NAME FROM CREATES C INNER JOIN TRIPS T ON C.TRIPID = T.ID WHERE C.USERNAME='" + username + "'";
	return query;
}


// do work for clicking the "Create New Album" button, which leads to create_album.jade page
exports.do_work = function(req, res){
  // query_db(req, res, req.session.username);
  query_db(req, res, req.session.username);
};