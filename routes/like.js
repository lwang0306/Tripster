// jade file previous is album_connect_display.jade
var oracle =  require("oracle");
// database connection string
var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

var results;
function query_db(req, res, username) {
  	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
			connection.execute (construct_query_likes(req.session.username, req.query.contentId),
				[], function(err, results3) {
					if (err) {
						console.log("construct_query_likes() error " + err);
					} else{
						if (results3.length > 0) {
							console.log("you have already liked this photo. ");
							connection.execute(contruct_query_find_content_url(req.session.albumId),
			  	        	[], function(err, results4) {
			  	        		if (err) {
			  	        			console.log("contruct_query_find_content_url() error " + err);
			  	        		} else {
			  	        			output_album_content(req, res, results4);
			  	        		}
			  	        });
						} else { // no records in likes table, now insert into likes	
							connection.execute(construct_query_insert_like(username, req.query.contentId), 
					  	    [], function(err, results) {
					  	    if (err) {
					  	    	console.log("Can't insert into LIKES table. " + err);
					  	    } else {
					  	    	console.log("Successfully saved to likes table!");
					  	        connection.execute(contruct_query_find_content_url(req.session.albumId),
					  	        	[], function(err, results1) {
					  	        		if (err) {
					  	        			console.log("Can't query results in like.js. " + err);
					  	        		} else {
					  	        			output_album_content(req, res, results1);
					  	        		}
					  	        });
					  	    	
					  	    }
					
					  	}); // end connection.execute
						}// end of else
					}
			}); 	
	    } // end else
    }); // end oracle.connect
}

function output_album_content(req, res, results) {
	
	res.render('album_content_display.jade',
		   {
		     title: "In Album", 	   	
		     results: results
		   }  
	);
}

function contruct_query_find_content_url(albumId) {
	// multiple results
	var query = "SELECT DISTINCT A.ID AS ALBUM_ID, C.ID AS CONTENT_ID, C.TYPE, COUNT(L.CONTENT_ID) AS LIKES_COUNT, CA.USERNAME AS CREATOR, C.URL AS CONTENTURL, A.NAME AS ALBUMNAME, A.PRIVACYFLAG AS PRIVACY FROM CONTENT C INNER JOIN ALBUMCONTENT AC ON C.ID = AC.CONTENT_ID INNER JOIN ALBUMS A ON A.ID = AC.ALBUM_ID INNER JOIN CREATEALBUM CA ON A.ID = CA.ALBUM_ID LEFT JOIN LIKES L ON C.ID = L.CONTENT_ID WHERE AC.ALBUM_ID = '" + albumId + "' GROUP BY C.ID, A.ID, CA.USERNAME, C.URL, A.NAME, A.PRIVACYFLAG, C.TYPE";
	return query;
}

function construct_query_insert_like(username, contentId) {
	var query = "INSERT INTO LIKES (USERNAME, CONTENT_ID) VALUES ('" + username + "', '" + contentId + "')";
	return query;
}

function construct_query_likes(username, contentId) {
	var query = "SELECT * FROM LIKES L WHERE L.USERNAME = '" + username + "' AND L.CONTENT_ID = '" + contentId + "'";
	return query;
}

exports.do_work = function(req, res){
  query_db(req, res, req.session.username);
  // query_db(req, res, "gsn");
};