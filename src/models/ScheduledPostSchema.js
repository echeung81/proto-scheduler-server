var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const postTitleMinLength = 1;	//descriptive title of scheduled post. this won't be a part of the post to the 3rd party site, but rather used to describe the post being scheduled
//i.e. ('3rd quarter marketing campaign, etc.', 'August shoe sale, etc.' )
const postTitleMaxLength = 255;

const postTextMinLength = 1; //post text for 3rd party website. TODO: should read from some config, as this is dependent on 3rd party limits
const postTextMaxLength	= 63000;	//facebook has a 63k character limit, instagram has a 10k limit etc.


var ScheduledPostSchema = new Schema({

	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: 'User id for scheduled post required'
	},

	upload_date: {

		type: Date,
		default: Date.now
	},

	scheduled_date_utc: {
		//TODO add TIME, hours minute seconds
		type: Date,
		required: 'Post schedule date required' //error message if date to schedule post is not included in this document
		//TODO scheduled date should be AFTER now, and maybe not more than X time in the future
	},

	scheduled_date_time_zone: {
		//TODO add TIME, hours minute seconds
		type: String, 	//should eventually be id which maps to timezone in database
		required: 'Post schedule date timezone required' //error message if date to schedule post is not included in this document
		//TODO scheduled date should be AFTER now, and maybe not more than X time in the future
	},

	post_title: {

		type: String,
		required: 'Post title required',
		minlength: [postTitleMinLength, 'Post title must be at least ' + postTitleMinLength + 'characters'], 
		maxlength: [postTitleMaxLength, 'Post title must be no more than ' + postTitleMaxLength + 'characters']
	},

	post_text: {

		type: String,
		minlength: [postTextMinLength, 'Post text must be at least ' + postTextMinLength + 'characters'],
		maxlength: [postTextMaxLength, 'Post text must be no more than ' + postTextMaxLength + 'characters']
	},

	post_images_paths: {

		type: [String]		//this will be the paths to list of image(s). TODO figure out how to make this point locally, or to a cloud service
	}
});

module.exports = mongoose.model('ScheduledPost', ScheduledPostSchema);