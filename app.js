/**
 * CIS550 Project
 * G28
 * Luyao Wang, Xia Deng, Juntao Wang, Yahang Zhang
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes') // index.js
  , login = require('./routes/login') // login.js
  , user = require('./routes/user') // user.js
  , signup = require('./routes/signup') // signup.js
  , register = require('./routes/register') // register
  , logout = require('./routes/logout') // logout.js
  , homepage = require('./routes/homepage') // homepage.js
  , edit = require('./routes/edit') // edit.js
  , edit_done = require('./routes/edit_done') // edit_done.js
  , notification = require('./routes/notification') // notification.js
  , confirm = require('./routes/confirm') // confirm.js
  , mongo = require('./routes/mongo')

  , trip = require('./routes/trip') // trip.js
  , atrip = require('./routes/atrip') // atrip.js
  , rate = require('./routes/rate') // rate.js
  , createtrip = require('./routes/createtrip')
  , newtrip = require('./routes/newtrip')
  , location = require('./routes/location')
  , glocation = require('./routes/glocation')
  , recommendation = require('./routes/recommendation')
  , applytrip = require('./routes/applytrip')
  , invite = require('./routes/invite')
  , invite_done = require('./routes/invite_done')

  , my_friends = require('./routes/my_friends') // my_friends.js
  , search_new_friend = require('./routes/search_new_friend') // searchnewfriend.js
  , friend_request_sent = require('./routes/friend_request_sent') // friendrequestsent.js
  , accept_friend_req = require('./routes/accept_friend_req')  // accept_friend_req.js
  , deny_friend_req = require('./routes/deny_friend_req') // deny_friend_req.js
  , other_user = require('./routes/other_user')  //other_user.js
  , add_content = require('./routes/add_content') // add_content.js
  , add_content_check = require('./routes/add_content_check') // add_content_check.js
  , content = require('./routes/content') // content.js
  , rate_content = require('./routes/rate_content') // rate_content.js
  , comment_content = require('./routes/comment_content') // rate_content.js


  , displayUserTrip = require('./routes/displayUserTrip') // displayUserTrip.js
  , album = require('./routes/album') // album.js
  , displayContentInAlbum = require('./routes/displayContentInAlbum')
  , like = require('./routes/like') // like.js



  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
// when we get a request for {app/login} we should call routes/login.js
app.post('/login', login.do_work);
// when we get a request for {app/user} we should call routes/user.js
app.get('/user', checkAuth, user.do_work);
// when we get a request for {app/homepage} we should call routes/homepage.js
app.get('/homepage', checkAuth, homepage.do_work);
// when we get a request for {app/signup} we should call routes/signup.js
app.get('/signup', signup.do_work);
// when we get a request for {app/signup} we should call routes/signup.js
app.post('/register', register.do_work);
// when we get a request for {app/logout} we should call routes/logout.js
app.get('/logout', logout.do_work);
// when we get a request for {app/edit} we should call routes/edit.js
app.get('/edit', checkAuth, edit.do_work);
// when we get a request for {app/edit_done} we should call routes/edit_done.js
app.post('/edit_done', checkAuth, edit_done.do_work);
// when we get a request for {app/confirm} we should call routes/confirm.js
app.post('/confirm', checkAuth, confirm.do_work);
// when we get a request for {app/notification} we should call routes/notification.js
app.get('/notification', checkAuth, notification.do_work);
// when we get a request for {app/add_content} we should call routes/add_content.js
app.get('/add_content', add_content.do_work);
// when we get a request for {app/add_content_check} we should call routes/add_content_check.js
app.post('/add_content_check', add_content_check.do_work);
// when we get a request for {app/content} we should call routes/content.js
app.post('/content', content.do_work);
// when we get a request for {app/rate_content} we should call routes/rate_content.js
app.post('/rate_content', rate_content.do_work);
// when we get a request for {app/rate_content} we should call routes/rate_content.js
app.post('/comment_content', comment_content.do_work);

app.get('/mongo', mongo.do_work);

app.get('/trip', checkAuth, trip.do_work);
app.get('/atrip', checkAuth, atrip.do_work);
app.post('/rate', checkAuth, rate.do_work);
app.get('/createtrip', checkAuth, createtrip.do_work);
app.post('/newtrip', checkAuth, newtrip.do_work);
app.post('/location', checkAuth, location.do_work);
app.get('/glocation', checkAuth, glocation.do_work);
app.get('/recommendation', checkAuth, recommendation.do_work);
app.post('/applytrip', checkAuth, applytrip.do_work);
app.post('/invite', checkAuth, invite.do_work);
app.post('/invite_done', checkAuth, invite_done.do_work);

// when we get a request for {app/my_friends} we should call routes/my_friends.js
app.get('/my_friends', my_friends.do_work);
// when we get a request for {app/search_new_friend} we should call routes/search_new_friend.js
app.get('/search_new_friend', search_new_friend.do_work);
// when we get a request for {app/friend_request_sent} we should call routes/friend_request_sent.js
app.get('/friend_request_sent', friend_request_sent.do_work);
// when we get a request for {app/accept_friend_req} we should call routes/accept_friend_req.js
app.get('/accept_friend_req', accept_friend_req.do_work);
// when we get a request for {app/deny_friend_req} we should call routes/deny_friend_req.js
app.get('/deny_friend_req', deny_friend_req.do_work);
// when we get a request for {app/other_user} we should call routes/other_user.js
app.get('/other_user', other_user.do_work);


// when we get a request for {app/user/createAlbum} we should call routes/displayUserTrip.js
app.get('/user/createAlbum', displayUserTrip.do_work); // just for display
// album is for test
app.get('/album', album.do_work);// insert into ALBUMS and TRIPALBUM

app.get('/displayContentInAlbum', displayContentInAlbum.do_work);

app.get('/like', like.do_work);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 3000);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('S3CRE7'));
	app.use(express.session());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}

// middleware function used on every route that needs the user to be authenticated
function checkAuth(req, res, next) {
	if (!req.session.username) {
		res.send('You are not authorized to view this page.');
	} else {
		next();
	}
}