var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function add_comment(req, res, content_id, username) {
    console.log("req.body.new_comment = " + req.body.new_comment);
    if (req.body.new_comment == undefined || req.body.new_comment == '') {
        req.body.comment_message = 'Comment cannot be empty!'
        req.body.contentId = content_id;
        var content = require('./content');
        content.do_work(req, res);
    } else {
        var query_find_existing = "SELECT * FROM RATECONTENT WHERE USERNAME = '"
        + username + "' AND CONTENT_ID = '" + content_id + "'";
        var insert_new_record = "INSERT INTO RATECONTENT VALUES ('" + username 
            + "', '" + content_id + "', '" + username + "', " + null + ", " + null + ")";
var update_new_comment = "UPDATE RATECONTENT SET COMMENTS='" + req.body.new_comment + "' WHERE USERNAME='" + username 
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
                    connection.execute(update_new_comment,
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
    add_comment(req, res, req.body.contentId, username);
};