let multer = require('multer');
let upload = multer({ dest: 'uploads/' });

module.exports = function(app) {

	var scheduledPostController = require('../controllers/ScheduledPostController');

	app.route('/scheduledPosts/:userId')
	.get(scheduledPostController.showScheduledPosts)
	.post(upload.array('files', 10), scheduledPostController.createScheduledPost);

	//edit posts
};