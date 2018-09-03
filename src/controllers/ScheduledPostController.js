var mongoose = require('mongoose');
var ScheduledPostSchema = require('../models/ScheduledPostSchema');
var ScheduledPost = mongoose.model('ScheduledPost'); 
var moment = require('moment-timezone');

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
	accessKeyId: '*********',
	secretAccessKey: '*********' 
})

var s3 = new AWS.S3();

exports.createScheduledPost = function(req, res) {

	//TODO: figure out how to validate the data coming in from a request
	console.log(req.get('Content-Type'));

  let formData = req.body;

  var scheduleDateUTC = formatScheduleDate(formData.scheduleDate, formData.scheduleTime, formData.scheduleTimeZone);

  console.log(scheduleDateUTC.getUTCMonth());
  console.log(scheduleDateUTC.getUTCDate());
  console.log(scheduleDateUTC.getUTCFullYear());
  console.log(scheduleDateUTC.getUTCHours());
  console.log(scheduleDateUTC.getUTCMinutes());
  console.log(scheduleDateUTC.getUTCSeconds());

  if(!req.files || req.files.length == 0) {

  	saveScheduledPost(formData, scheduleDateUTC, formData.scheduleTimeZone, []);	
  } else {

  		 var filePaths = [];
  		var fileCount = req.files.length;


  	  //handle file saving
	  req.files.forEach(file => {

	  	var userId = 1;
		  	var key = "users/" + userId + "/"+ date +"/" + file.originalname;

		  	console.log(key);
		  
		  	//configuring parameters
			var params = {
		  			Bucket: 'proto-scheduler',
		  			Body : fs.createReadStream(file.path),
		  			Key : key
			};

			s3.upload(params, function(err, data) {

				if(err) {
					console.log("S3 upload Err: ", err);
				}

				if(data) {

					filePaths.push(data.Location);

					fileCount--;
					//finished saving all files to s3, finally save scheduled post
					if (fileCount == 0) {
						saveScheduledPost(formData, scheduleDateUTC, formData.scheduleTimeZone, filePaths);
					}
				}
			});
	  });

	}
};

function formatScheduleDate(date, time, timeZone) {

	var dateStr = date + ' ' + time;

	return moment.tz(dateStr, timeZone).utc().toDate();
}

function saveScheduledPost(formData, scheduleDateUTC, scheduleDateTimeZone, filePaths) {

	var newScheduledPost = new ScheduledPostSchema();
	
	newScheduledPost.user_id = mongoose.Types.ObjectId('5b7dce76b9c6ec7de46a7a73');
	newScheduledPost.scheduled_date_utc = scheduleDateUTC;
	newScheduledPost.scheduled_date_time_zone = scheduleDateTimeZone;
	newScheduledPost.post_title = formData.title;
	newScheduledPost.post_text = formData.text;
	console.log('filePaths: ' + filePaths.length);
	newScheduledPost.post_images_paths = filePaths;

	newScheduledPost.save((function (err) {
								if (err) 
									{ console.log("error saving record: ", err); }
								else {
									console.log("saved record");
								}
								}));

}



exports.showScheduledPosts = function(req, res) {


}

exports.deleteScheduledPost = function(req, res) {


}