var oracle =  require("oracle");

var connectData = {
    hostname: "",
    port: ,
    database: "", // System ID (SID)
    user: "",
    password: ""
}

var yelp = require("yelp").createClient({
  	consumer_key: "OWdGQ2YBmOwGA3sX4q6D6Q", 
  	consumer_secret: "7Xwtd1o2ckp8VFVBCCr_KikAxmg",
  	token: "X6zjDgWB8U0yvXUmBHrhPxD6QjEdFZk3",
  	token_secret: "vCRhocQzNo_xMybSKb4B3mGrZ3U"
});

function query_db(req, res, location) {
	var sql = "SELECT T.NAME, T.TIME " +
				"FROM PLANNED P " +
				"INNER JOIN TRIPS T ON P.TRIPID = T.ID " +
				"WHERE P.LOCATIONNAME = '" + location + "'";

  	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute(sql, [], function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
			  	// console.log(results);
			  	connection.close();
			  	yelp.search({term: "food", location: location, limit: 3}, function(error, food) {
					if (error)
			  			console.log(error);
			  		else {
			  			// console.log(food);
			  			yelp.search({term: "hotel", location: location, limit: 3}, function(error, hotel) {
							if (error)
					  			console.log(error);
					  		else {
					  			// console.log(hotel);
					  			res.render('location.jade', { 
							  		title: 'Trips happen at ' + location,
							  		results: results,
							  		food: food,
							  		hotel: hotel
							  	});
 					 		}
						});
			  		}
				});
	  	    }
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

exports.do_work = function(req, res){
	var username = req.session.username;
	var location = req.query.location
	query_db(req, res, location);
};