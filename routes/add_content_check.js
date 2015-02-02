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
function query_db(req, res, username, message) {
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
                res.render('add_content.jade', {
                    albums: albums,
                    message: message
                });
    		}
    	});
    }
});
}



function add_to_db(req, res, url, type, newID, username, albumid) {
    var query = "INSERT INTO CONTENT VALUES ('" + username + "', '" 
        + type + "', '" + url + "', '" + newID + "', '0')";
    var query2 = "INSERT INTO ALBUMCONTENT VALUES ('" + albumid + "', '" 
        + newID + "')";
    oracle.connect(connectData, function(err, connection) {
    if ( err ) {
        console.log(err);
    } else {        
        connection.execute(query,
            [],
            function(err, result) {
            if ( err ) {
                console.log(err);
            } else {
                connection.execute(query2,
                    [],
                    function(err2, result2) {
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log('Content added.');
                            req.body.contentId = newID;
                            var content = require('./content');
                            content.do_work(req, res);
                        }
                    });
            }
        });
    }
});
}

function add_to_album_and_show(req, res, url, type, albumid, username) {
    var query_max_id = "SELECT MAX(ID) AS MAX_ID FROM CONTENT";
    oracle.connect(connectData, function(err, connection) {
    if ( err ) {
        console.log(err);
    } else {        
        connection.execute(query_max_id,
            [],
            function(err, maxID) {
            if ( err ) {
                console.log(err);
            } else {
                var newID = parseInt(maxID[0].MAX_ID, 10) + 1;
                add_to_db(req, res, url, type, newID, username, albumid);
            }
        });
    }
});
}

function check_and_add(req, res, url, type, albumid, username) {
    if(url == '' || type == undefined || albumid == undefined) {
        var message = "All fields are required!";
        query_db(req, res, username, message);
    } else {
        add_to_album_and_show(req, res, url, type, albumid, username);
    }
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
	check_and_add(req, res, req.body.url, req.body.Type, req.body.Album, username);
};