var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function query_db(req, res, username, tripid) {
  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(create_query(username, tripid), 
    		[], function(err, friends) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log(friends);
                    req.session.friends = friends;
    				render_page(req, res);;
    			}
    		});
    }
});
}

function create_query(username, tripid) {
	var query = "SELECT USERNAME2 FROM FRIENDS WHERE USERNAME1='" + username + "' " +
				"MINUS " +
				"SELECT F.USERNAME2 FROM FRIENDS F " +
				"INNER JOIN ONTRIP O ON O.USERNAME = F.USERNAME2 " +
				"WHERE O.TRIPID='" + tripid + "' AND F.USERNAME1='" + username + "' " + 
                "MINUS " +
                "SELECT I.USERNAME FROM INVITE I " + 
                "INNER JOIN FRIENDS F ON F.USERNAME2 = I.USERNAME " + 
                "WHERE F.USERNAME1='" + username + "' AND I.TRIPID='" + tripid + "'";
	return query;
}

function render_page(req, res) {
	res.render('invite.jade', {
        title: 'Invitng Friends',
  		friends: req.session.friends
  	});
}

exports.do_work = function(req, res){
	query_db(req, res, req.session.username, req.session.tripid);
};