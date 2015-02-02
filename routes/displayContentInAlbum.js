var oracle =  require("oracle");
// database connection string
var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

var likesCount;

function query_db(req, res) {
  	oracle.connect(connectData, function(err, connection) {
	    if (err) {
	    	console.log(err);
	    } else {
	    	// CONNECTION with yahang atrip.jade
	    	var albumId = parseInt(req.query.albumId, 10); 
	    	// var albumId = 1;
	    	req.session.albumId = albumId;
	        
		  	connection.execute(contruct_query_find_content_url(albumId), 
		  	    [], function(err, results) {
		  	    if (err) {
		  	    	console.log("Can't find contentId by the given albumId " + err);
		  	    } else {
		  	    	if (results.length != 0) {
		  	    	req.session.photoDisplay = results;
		  	    		if (results[0].PRIVACY == "public" || (results[0].PRIVACY == "private" && results[0].CREATOR == req.session.username)) {
		  	    		// if (results[0].PRIVACY == "public" || (results[0].PRIVACY == "private" && results[0].CREATOR == "gsn" )) {
			  	    		connection.execute(construct_query_count_likes(parseInt(req.query.contentId, 10)),
								[], function(err, results1) {
									if (err) {
										console.log("Problem counting likes. " + err);
									} else {
										req.session.likesCount = parseInt(results1[0].LIKES_COUNT, 10);
									}
								});
		  	    			output_album_content(res, req, results);
		  	    		}
		  	    		if (results[0].PRIVACY == "private" && results[0].CREATOR != req.session.username ) {
		  	    		// if (results[0].PRIVACY == "private" && results[0].CREATOR != "gsn" ) {
		  	    			block_album_content(res);
		  	    		}

		  	    		if (results[0].PRIVACY == "share") {
		  	    			connection.execute(contruct_query_find_trip_members(albumId),
		  	    			[], function(err, results1) {
		  	    				if (err) {
		  	    					console.log("Can't find trip members through albumId " + err);
		  	    				} else {
		  	    					for (var i = 0; i < results1.length; i++) {
		  	    						if (results1[i].USERNAME == req.session.username) {
		  	    						// if (results1[i].USERNAME == "gsn") {
		  	    							output_album_content(res, req, results);
		  	    							break;
		  	    						} else {
		  	    							block_album_content(res);
		  	    						}
		  	    					} // end of for loop
		  	    				}
		  	    			});
		  	    		}
		  	    		
		  	    	} else { // album has no content yet. 
		  	    		console.log("You don't have any photo/video yet.");
		  	    		res.redirect('/add_content');    //CONNECTION with luyao
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    } // end else
    }); // end oracle.connect
}


function contruct_query_find_content_url(albumId) {
	// multiple results
	var query = "SELECT DISTINCT A.ID AS ALBUM_ID, C.ID AS CONTENT_ID, C.TYPE, COUNT(L.CONTENT_ID) AS LIKES_COUNT, CA.USERNAME AS CREATOR, C.URL AS CONTENTURL, A.NAME AS ALBUMNAME, A.PRIVACYFLAG AS PRIVACY FROM CONTENT C INNER JOIN ALBUMCONTENT AC ON C.ID = AC.CONTENT_ID INNER JOIN ALBUMS A ON A.ID = AC.ALBUM_ID INNER JOIN CREATEALBUM CA ON A.ID = CA.ALBUM_ID LEFT JOIN LIKES L ON C.ID = L.CONTENT_ID WHERE AC.ALBUM_ID = '" + albumId + "' GROUP BY C.ID, A.ID, CA.USERNAME, C.URL, A.NAME, A.PRIVACYFLAG, C.TYPE " +
				"ORDER BY CONTENT_ID";
	return query;
}

function contruct_query_find_trip_members(albumId) {
	var query = "SELECT DISTINCT TA.TRIPID, O.USERNAME FROM TRIPALBUM TA INNER JOIN ALBUMS A ON TA.ALBUMID = A.ID INNER JOIN ONTRIP O ON O.TRIPID = TA.TRIPID WHERE A.ID = '" + albumId + "'";
	return query;
}

function construct_query_count_likes(contentId) {
	var query = "SELECT COUNT (*) AS LIKES_COUNT FROM LIKES WHERE CONTENT_ID = '" + contentId + "'";
	return query;
}

// render album_content_display.jade page 
function output_album_content(res, req, results) {
	res.render('album_content_display.jade',
		   { 
		   	 title: "In Album ",
		   	 results: results 
		   }  
	);
}

function block_album_content(res) {
	res.render('cannot_view_album.jade',
		   { title: "Not Authorized to View" }  
	);
}

exports.do_work = function(req, res){
  	query_db(req, res);
};