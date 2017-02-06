var mongoose = require('mongoose');
var UserRolesSchema = new mongoose.Schema({
	// can access admin area
	super_admin: [{
		can_admin: {
			type: Boolean,
			default: true
		},
		manage_posts: {
			type: Boolean,
			default: true
		},
		manage_users: {
			type: Boolean,
			default: true
		}
	}],
	admin: [{
		can_admin: {
			type: Boolean,
			default: true
		},
		manage_posts:  {
			type: Boolean,
			default: true
		},
		manage_users:  {
			type: Boolean,
			default: true
		}
	}],
	editor: [{
		can_admin: {
			type: Boolean,
			default: true
		},
		manage_posts:  {
			type: Boolean,
			default: true
		},
		manage_users:  {
			type: Boolean,
			default: false
		}
	}],
	// can't access admin area
	subscriber: [{
		can_admin: {
			type: Boolean,
			default: false
		},
		manage_posts: {
			type: Boolean,
			default: false
		},
		manage_users: {
			type: Boolean,
			default: false
		}
	}],
	visitor: [{
		can_admin: {
			type: Boolean,
			default: false
		},
		manage_posts: {
			type: Boolean,
			default: false
		},
		manage_users: {
			type: Boolean,
			default: false
		}
	}]
});