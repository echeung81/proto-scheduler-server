var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var https = require('https');
var request = require('request-promise');  

console.log('STARTING APP...');

//express setup
var app = express();
var port =  process.env.PORT || 5000;

//mongo db setup
const mongoURL = 'mongodb://localhost:27017/';
const dbName = 'scheduler-proto';

mongoose.Promise = global.Promise;
mongoose.connect(mongoURL + dbName);

//body parser for parsing http requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//set up routes
var spRoutes = require('./routes/ScheduledPostRoutes');
spRoutes(app);

app.get('/ping', function(req, res) {
	return res.send('pong');
});

app.get('/testpost/:tid', (req, res) => {

	const options = {

		method: 'POST',
		uri: 'https://graph.facebook.com/v3.1/1937546926538760/feed',
		qs: {
			access_token: 'EAAGuzRQomEQBAPbTX93GVt0UV6EZAP8r4IEuJKBfZBBJ8zThqUAJOQc6xRfxBT15RPpWQQpYvyqUeL0X8pBVe4QKOQETmYSwYZAZAQZABlYAdeoGlGqHI58TM0Hv5PEl2FRRn2DE9F7A6ULjD6ZBXJn5ElZA3mgFJEZD',
			message: 'testing testing 122' + req.params.tid
		}
	}

	request(options)
		.then(fbRes => {
			res.json(fbRes);
		});
});
s
//FB permissions grants
app.get('/grantFBPermissions', (req, res) =>  {
	res.sendFile(path.join(__dirname, '../dist/app/fbPagePermissions.html'));
});

//redirect after user grants permissions to manage and publish pages
app.get('/verifyFBGrant', (req, res) => {

	if(req.query.code) {

	const options = {

		method: 'POST',
		uri: 'https://graph.facebook.com/v3.1/oauth/access_token',
		qs: {
			client_id: '473670806444100',
			client_secret: '2f24aa03bbdffffdf519877e535c3f29',
			code: req.query.code,
			redirect_uri: 'https://warm-shore-15013.herokuapp.com/verifyFBGrant'
		}
	};

	request(options).then(fbRes => {
			res.json(fbRes);
		});

	} else {

		console.log('non code verifyFBGrant: ' + JSON.stringify(req.query, null, 2));

	}
});

app.get('/codeForToken', (req, res) => {
	res.send('success token');
});

//client react app
app.use('/app', express.static('dist/app/'));

//invalid request
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port, () => console.log(`Listening on ${ port }`));
/*
//create an http server
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port); */

console.log('task server started on ' + port);

/*

https://graph.facebook.com/v3.1/oauth/access_token?
   client_id=473670806444100&redirect_uri=https://warm-shore-15013.herokuapp.com/verifyFBGrant&client_secret=2f24aa03bbdffffdf519877e535c3f29&code=AQCglqNCCX2bjFb95i7b2oRW_dfzpxOn70Q3pjI8YHJOcTPfjYBkkYTouBlv9LxJRVj3oT4G_xtJ0O5okBS9S6L6rKBUZ-VkJbl1JEUwAMylWiFJNikpNY94gI41rz4D-SKhszV8FL_-Do5E0m524aRFB3qwLQmdT9pToK4mJZk_-d-oaKhcF7a07NcPN74WNJ3b_1MEyHCSt2a-A2iR-J9rtIGqukFdSLsJ2W0F9R6EHVJVMbUpNMfy_47uuShvfy_DKV-M6jAOpBm-YkFMq9GgkySQaMU1-hL36ZgdjNHi18SVYWHcLumVbLlFUjXn604


   */