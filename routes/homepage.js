var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	query = create_search_newtrip_query(req.session.username);
    	connection.execute(query, [], function(err, creators) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log(creators);
                    var query2 = create_search_newalbum_query(req.session.username);
    				connection.execute(query2, [], function(err, acreators) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(acreators);
                            res.render('homepage.jade', {
                                title: 'Welcome! ' + req.session.name,
                                username: req.session.username,
                                portrait: req.session.portrait,
                                creators: creators,
                                acreators: acreators
                            });
                        }
                    });
    			}
    		});
    }
});
}

function create_search_newtrip_query(username) {
	var query = "SELECT C.USERNAME, C.TRIPID, T.NAME FROM CREATES C " +
				"INNER JOIN TRIPS T ON T.ID = C.TRIPID " +
				"WHERE C.USERNAME IN " + 
				"(SELECT USERNAME2 FROM FRIENDS WHERE USERNAME1='" + username + "' AND STATUS = 'accepted') " +
				"AND ROWNUM <= 5 " + 
				"ORDER BY TRIPID DESC";
	return query;
}

function create_search_newalbum_query(username) {
    var query = "SELECT C.USERNAME, C.ALBUM_ID, A.NAME FROM CREATEALBUM C " +
                "INNER JOIN ALBUMS A ON A.ID = C.ALBUM_ID " +
                "WHERE C.USERNAME IN " + 
                "(SELECT USERNAME2 FROM FRIENDS WHERE USERNAME1='" + username + "' AND STATUS = 'accepted') " +
                "AND ROWNUM <= 5 " + 
                "ORDER BY C.ALBUM_ID DESC";
    return query;
}

exports.do_work = function(req, res){
  	query_db(req, res);
};