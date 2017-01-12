var mongoose = require('mongoose');
var CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		description: String,
		img_link: String
	}
);

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;

