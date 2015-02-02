exports.do_work = function(req, res){
	// delete req.session.username;
	// delete req.session.name;
	// delete req.session.password;
	// delete req.session.email;
	// delete req.session.affiliation;
	// delete req.session.interests;
	delete req.session;
  	res.render('logout.jade');
};