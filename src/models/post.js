var mongoose = require('mongoose');
var PostsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		slug: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		user_id: String,
		body: String,
		categories: Array,
		feat_img: String,
		date: Date
	}
);

var Posts = mongoose.model('Posts', PostsSchema);
module.exports = Posts;

