var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

////
// find all albums that a user can edit and list them, render the webpage
//
function query_db(req, res, username) {
	var query = "SELECT DISTINCT A.ID AS ID, A.NAME AS NAME FROM ALBUMS A, TRIPALBUM T, ONTRIP O WHERE O.USERNAME = '"
	+ username + "' AND O.TRIPID = T.TRIPID AND T.ALBUMID = A.ID AND A.PRIVACYFLAG != 'private'"
	+"UNION SELECT DISTINCT A.ID AS ID, A.NAME AS NAME FROM ALBUMS A, CREATES C, TRIPALBUM T WHERE C.USERNAME = '"
	+ username + "' AND C.TRIPID = T.TRIPID AND T.ALBUMID = A.ID AND A.PRIVACYFLAG = 'private'";
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {    	
    	connection.execute(query,
    		[],
    		function(err, albums) {
    		if ( err ) {
    			console.log(err);
    		} else {
    			console.log(albums);
    			// if the user received request from requester but did not send request to the requester
    			// add a record to complete the double-way request
    			if (albums.length == 0) {
    				res.render('add_content.jade', {
    					noAlbum: true
    				});
    			} else {
                     res.render('add_content.jade', {
                     	albums: albums
                     })
                }
    		}
    	});
    }
});
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	var username = req.session.username;
    query_db(req, res, username);
};