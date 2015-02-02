var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

/////
// check the relationship status between two users, and respond to add friend request
//
// targetUsername = the target username to sent request to
function show_friends(req, res, username) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	connection.execute("SELECT * FROM FRIENDS WHERE USERNAME1='" + username + "' AND STATUS='accepted'",
    		[],
    		function(err, existing) {
    		if ( err ) {
    			console.log(err);
    		} else {
    			console.log(existing);
                if (existing.length == 0) {
                    res.render('my_friends.jade',
                        {title: 'My Friends',
                        message: "Currently, you don't have any friends. Search for a new one!"});
                } else {
                    // results = render_string(existing);
                    res.render('my_friends.jade',
                    {title: 'My Friends',
                    message: 'Keep in touch with your friends:',
                    showResults: true,
                    results: existing});
                }
    		}
    	}); // end of connection.execute
    }
}); // end of orocal.connect
}

////
// render a string for jade to output
//
// the query result
function render_string(existing) {
    var i;
    var results = '';
    console.log("Length = " + existing.length);
    for (i = 0; i < existing.length; i++) {
        results += existing[i].USERNAME2 + '\n';
    }
    return results;
}


/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
	show_friends(req, res, username);
};
