var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function add_rate(req, res, content_id, username) {
    if (req.body.new_rate == undefined || req.body.new_rate == '') {
        req.body.rate_message = 'Rate cannot be empty!'
        req.body.contentId = content_id;
        var content = require('./content');
        content.do_work(req, res);
    } else {
        var query_find_existing = "SELECT * FROM RATECONTENT WHERE USERNAME = '"
        + username + "' AND CONTENT_ID = '" + content_id + "'";
        var insert_new_record = "INSERT INTO RATECONTENT VALUES ('" + username 
            + "', '" + content_id + "', '" + username + "', " + null + ", " + null + ")";
var update_new_rate = "UPDATE RATECONTENT SET SCORE=" + req.body.new_rate + " WHERE USERNAME='" + username 
+ "' AND CONTENT_ID='" + content_id + "'";
oracle.connect(connectData, function(err, connection) {
    if ( err ) {
        console.log(err);
    } else {        
        connection.execute(query_find_existing,
            [],
            function(err, existing) {
                if ( err ) {
                    console.log(err);
                } else {
                    if (existing.length == 0) {
                        connection.execute(insert_new_record,
                            [],
                            function(err, existing) {
                                if ( err ) {
                                    console.log(err);
                                }
                            });
                    } 
                    connection.execute(update_new_rate,
                        [],
                        function(err, existing) {
                            if ( err ) {
                                console.log(err);
                            } else {
                                req.body.contentId = content_id;
                                var content = require('./content');
                                content.do_work(req, res);
                            }
                        });
                    
                }
            });
}
});
}
}



/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
    add_rate(req, res, req.body.contentId, username);
};