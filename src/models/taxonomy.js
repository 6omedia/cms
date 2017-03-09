var mongoose = require('mongoose');

var TaxonomyTerm = new mongoose.Schema(
	{
		term_name: String,
		description: String,
		img_link: String,
		parent: {
			type: String,
			default: '0'
		}
	}
);

var TaxonomySchema = new mongoose.Schema(
	{
		taxonomy_name: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		taxonomy_description: String,
		taxonomy_terms: [TaxonomyTerm]
	}
);

var Taxonomy = mongoose.model('Taxonomy', TaxonomySchema);
module.exports = Taxonomy;

