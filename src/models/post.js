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
		date: Date,
		user_id: String,
		user_name: String,
		body: String,
		taxonomies: [{
			tax_name: String,
			terms: Array
		}],
		feat_img: String
	}
);

var Posts = mongoose.model('Posts', PostsSchema);
module.exports = Posts;

