var oracle =  require("oracle");
// var	trip = require('./routes/trip');

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

function insert_db(req, res, sql) {
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	if (req.body.rate.length != 0) {
		    	connection.execute(sql, [], function(err, results) {
		    		if (err) {
		    			console.log(err);
		    		} else {
		    			connection.close();
		    			res.render('rate.jade', {
		    				message: 'Thank you for rating.'
		    			});	
		    		}
		    	})
		    } else {
		    	connection.close();
		    	res.render('rate.jade', {
		    		message: 'Rate can not be left empty, please rate again.'
		    	});
		    }
    	}
    });
}

exports.do_work = function(req, res) {
	var tripid = "1";
	var username = req.session.usernamesn;
	var rate = req.body.rate;
	var comment = req.body.comment;

	var sql = "INSERT INTO RATETRIP VALUES ('" + tripid + "', '" 
		+ username + "', '" + rate + "', '" + comment + "')";
	insert_db(req, res, sql);
}