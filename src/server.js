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
	console.log('ey? anything happening');
	return res.send('pong');
});

app.get('/testpost/:tid', (req, res) => {

	const options = {

		method: 'POST',
		uri: 'https://graph.facebook.com/v3.1/1937546926538760/feed',
		qs: {
			access_token: 'EAAGuzRQomEQBAENYmLXzxBOZC3VLYXT0ucZBu7oEwnnAB0QNc2TcE8yAhZCfHaaLizEi1MZBPghnNYBZAMGrq0gAOLajMJdk0VMNI78dvxZBTV02ugd9XFzDWtuSyMavrxheDYohTS5NTVtTT4BB5ZBYTZCapbeZAGboHSw9AxYs7ngZDZD',
			message: 'testing testing 12' + req.params.tid
		}
	}

	request(options)
		.then(fbRes => {
			res.json(fbRes);
		});
});

//FB permissions grants
app.get('/grantFBPermissions', (req, res) =>  {
	res.sendFile(path.join(__dirname, '../dist/app/fbPagePermissions.html'));
});

//redirect after user grants permissions to manage and publish pages
app.get('/verifyFBGrant', (req, res) => {
	console.log('hostname: ' + req.hostname);
	console.log('body: ' + JSON.stringify(req.body, null, 4));
	console.log('ip:' + req.ip);
	console.log('query string: ' + JSON.stringify(req.query, null, 4));

	res.send('success');

});

//client react app
app.use('/app', express.static('dist/app/'));

//invalid request
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port, () => console.log(`Listening on ${ PORT }`));
/*
//create an http server
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port); */

console.log('task server started on ' + port);