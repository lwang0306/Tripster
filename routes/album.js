var oracle =  require("oracle");
// database connection string
var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}
   

/**
 * insert the data get from the "GET" action to the the ALBUMS table.
 */
function insert_db_albums_tripAlbum(req, res) {
	oracle.connect(connectData, function(err, connection) {
	    if (err) {
	    	console.log(err);
	    } else {
	    	// Get form data
	    	var albumName = req.query.album_name;
	    	// var tripName = req.query.RadioGroup1;
	    	var privacyFlag = req.query.RadioGroup2;
	        // output is the max album_id + 1, which will be inserted as ID in ALBUMS
	        var output;

	        var tripName = req.query.RadioGroup1;
	    	var tripId;
	    	var albumId;

        	connection.execute(construct_query_get_max_albumId(),[],
    			function(err, results) {
		            if (err) { 
		            	console.log("There was a problem getting current max albumId in ALBUMS. " + err);
		            } else {
		            	console.log("get max albumId successfully.");
		            	if (results[0].MAX_ID != null) { // non-empty ALBUMS table
		            		console.log("results[0].MAX_ID + 1 is: " + parseInt((parseInt(results[0].MAX_ID, 10) + 1), 10));
		            		output = parseInt((parseInt(results[0].MAX_ID, 10) + 1), 10);
		            		// execute insertion query when you have already computed output
		            		connection.execute(construct_query_insert_albums(output, albumName, privacyFlag),[],
    							function(err, results) {
    								if (err) {
    									console.log("Can't insert into ALBUMS " + err);
    								} else {
    									console.log("Successfully insert into ALBUMS!");
    									connection.execute(construct_query_get_tripId(tripName),[], 
		        							function(err, results) {
		        								if (err) { 
		            								console.log("There was a problem getting tripId." + err);
		            							} else {
		            								console.log("get tripId successfully from tripName.");
		            									tripId = parseInt(results[0].TRIP_ID, 10);// tripId is NUMBER(autoincrement)
		            									connection.execute(construct_query_get_albumId(albumName),[],
		        											function(err, results) {
		        												if (err) { 
		            												console.log("There was a problem getting albumId." + err);
		            											} else {
					            									console.log("get albumId successfully.");
					            									albumId = parseInt(results[0].ALBUM_ID, 10);// albumId is NUMBER(autoincrement)
					            									connection.execute(construct_query_insert_tripAlbum(tripId, albumId),[],
				        												function(err, results) {
				            												if (err) { 
				            													console.log(err);
				            												} else {
				            													console.log("insert into TRIPALBUM successfully.");
				            												}
				        											});
		            											}
		            										});
		            							}
	    								});
    								}
		            		});
		            	} else { // empty ALBUMS table
		            		console.log("ALBUMS is empty now.");
		            		output = 1;
		            		connection.execute(construct_query_insert_albums(output, albumName, privacyFlag),[],
    							function(err, results) {
    								if (err) {
    									console.log("Can't insert into ALBUMS " + err);
    								} else {
    									console.log("Successfully insert into ALBUMS!");
    									connection.execute(construct_query_get_tripId(tripName),[], 
		        							function(err, results) {
		        								if (err) { 
		            								console.log("There was a problem getting tripId." + err);
		            							} else {
		            								console.log("get tripId successfully from tripName.");
		            									tripId = parseInt(results[0].TRIP_ID, 10);// tripId is NUMBER(autoincrement)
		            									connection.execute(construct_query_get_albumId(albumName),[],
		        											function(err, results) {
		        												if (err) { 
		            												console.log("There was a problem getting albumId." + err);
		            											} else {
					            									console.log("get albumId successfully.");
					            									albumId = parseInt(results[0].ALBUM_ID, 10);// albumId is NUMBER(autoincrement)
					            									connection.execute(construct_query_insert_tripAlbum(tripId, albumId),[],
				        												function(err, results) {
				            												if (err) { 
				            													console.log(err);
				            												} else {
				            													console.log("Insert into TRIPALBUM successfully!");
				            												}
				        											});
		            											}
		            										});
		            							}
	    								});
    								}
		            		});
		                }
		            }
    		});// end of execute construct_query_get_max_albumId()
		}
		// connection.close(); Asychronize Problem, cannot close. 
	});
}


function construct_query_get_tripName(username) {
	var query = "SELECT T.NAME FROM CREATES C INNER JOIN TRIPS T ON C.TRIPID = T.ID WHERE C.USERNAME = '" + username + "'";
	return query;
}

function construct_query_insert_albums(albumId, albumName, privacyFlag) {
	// takes care of the auto increment of albumId 
	var query = "INSERT INTO ALBUMS (ID, NAME, PRIVACYFLAG) VALUES ('" + albumId + "', '" + albumName + "', '" + privacyFlag + "')";
	return query;
}

function construct_query_insert_tripAlbum(tripId, albumId) {
	var query = "INSERT INTO TRIPALBUM (TRIPID, ALBUMID) VALUES ('" + tripId + "', '" + albumId + "')";
	return query;
}

function construct_query_get_tripId(tripName) {
	var query = "SELECT T.ID AS TRIP_ID FROM TRIPS T WHERE T.NAME = '" + tripName + "'";
	return query;
}

function construct_query_get_albumId(albumName) {
	var query = "SELECT A.ID AS ALBUM_ID FROM ALBUMS A WHERE A.NAME = '" + albumName + "'";
	return query;
}

function construct_query_get_max_albumId() {
	var query = "SELECT MAX(ID) AS MAX_ID FROM ALBUMS";
	return query;
}

exports.do_work = function(req, res){
  	console.log("req.query.album_name is: " + req.query.album_name);
  	insert_db_albums_tripAlbum(req, res); // Insert into ALBUMS
  	res.render('albumCreated.jade', 
  			{ title: req.query.album_name } 
  	);
};