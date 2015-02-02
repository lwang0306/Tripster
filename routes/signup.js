exports.do_work = function(req, res){
  	res.render('signup.jade', {
  		message: 'Field with a * can not be left blank!'
  	});
};