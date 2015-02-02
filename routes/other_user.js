var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function view_profile(req, res, username, otherUser) {
	var query = "SELECT * FROM FRIENDS WHERE USERNAME1='" + username + "' AND USERNAME2='" 
		+ otherUser + "' AND STATUS='accepted'";
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute(query,
    		[],
    		function(err, results) {
    		if ( err ) {
    			console.log(err);
    		} else {
    			if (results.length != 0) {
    				var query2 = "SELECT * FROM USERS WHERE USERNAME='" + otherUser + "'";
    				connection.execute(query2,
    					[],
    					function(err, user) {
    						if (err) {
    							console.log(err);
    						} else {
    						res.render('other_user.jade', {
  								title: "Welcome to " + otherUser + "'s Homepage!",
  								username: otherUser,
  								isFriend: true,
  								user: user[0]
    							});
    						}
    			});	
    		} else {
    			res.render('other_user.jade', {
    				title: "Welcome to " + otherUser + "'s Homepage!",
    				username: otherUser,
    				isFriend: false
    			});
    		}
    	}
    	});
    }
});

}

exports.do_work = function(req, res){
	var username = req.session.username;
	var otherUser = req.query.other;
  	view_profile(req, res, username, otherUser);
};