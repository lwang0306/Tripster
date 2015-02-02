var mongo = require('./mongo');

var oracle =  require("oracle");

var connectData = {
	hostname: "",
	port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function show_content(req, res, content_id, username) {
    var query_find_content = "SELECT * FROM CONTENT WHERE ID = '" + content_id + "'";
    var query_find_album = "SELECT * FROM ALBUMCONTENT WHERE CONTENT_ID = '" 
    + content_id + "'";
    var query_avg_score = "SELECT AVG(SCORE) AS AVG_SCORE FROM RATECONTENT WHERE CONTENT_ID = '"
    + content_id + "'";
    var query_comments = "SELECT USERNAME, COMMENTS FROM RATECONTENT WHERE CONTENT_ID = '"
    + content_id + "'";
    var times_add_one = "UPDATE CONTENT SET TIMES=TIMES + 1 WHERE ID='" + content_id + "'";
    var user_rate_comment = "SELECT SCORE AS RATE, COMMENTS FROM RATECONTENT WHERE CONTENT_ID = '" + content_id 
    + "' AND USERNAME = '" + username + "'";
    oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {        
            connection.execute(query_find_content,
                [],
                function(err, result) {
                    if ( err ) {
                        console.log(err);
                    } else {

                        if (result[0].TIMES == 10 && result[0].TYPE == 'photo') {
                            var path = 'public/images/' + result[0].ID + '.jpg';
                            mongo.do_work(req, res, result[0].URL, path);
                        }

                        connection.execute(query_find_album,
                            [],
                            function(err, album) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    connection.execute(query_avg_score,
                                      [],
                                      function(err, avgRate) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            connection.execute(query_comments,
                                              [],
                                              function(err, comments) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    connection.execute(times_add_one,
                                                      [],
                                                      function(err, add) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            connection.execute(user_rate_comment,
                                                      [],
                                                      function(err, rate_comment) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            var isRated = false;
                                                            var isCommented = false;
                                                            var isVideo = false;
                                                            if (rate_comment.length > 0 && rate_comment[0].RATE != null) {
                                                                isRated = true;
                                                            }
                                                            if (rate_comment.length > 0 && rate_comment[0].COMMENTS != null) {
                                                                isCommented = true;
                                                            }
                                                            if (result[0].TYPE == 'video') {
                                                                isVideo = true;
                                                            }
                                                            console.log("isRated = " + isRated);
                                                            console.log("isCommented = " + isCommented);
                                                            res.render('content.jade', {
                                                                contentId: content_id,
                                                                url: result[0].URL,
                                                                type: result[0].TYPE,
                                                                source: result[0].SOURCE,
                                                                album_id: album[0].ALBUM_ID,
                                                                avg_rate: avgRate[0].AVG_SCORE,
                                                                comments: comments,
                                                                times: result[0].TIMES,
                                                                is_rated: isRated,
                                                                is_commented: isCommented,
                                                                is_video: isVideo
                                                            });
                                                        }
                                                    });
                                                        }
                                                    });
}
});
}
});
}
});
}
});
}
});
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
    var username = req.session.username;
    show_content(req, res, req.body.contentId, username);
};