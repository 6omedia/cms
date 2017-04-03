/*****************************
	Initial Setup
******************************/

1)

	Upload json files in the init data to json folder

	then there will be one admin user.

	Email: admin@admin
	password: 123

	Add User
	mongoimport --db zmot --collection users --file c:/dev/node/zmot/users.json
	Once logged in for the first time 
	Change the password of admin@admin

2)
	
	Create a config.js in the folders root and add the following with the correct
	credentials...

		module.exports = {

			get_config_vars: function(){
				return {
					env_database: "mongodb://{username}:{password}@localhost:27017/{dbname}",
					env_bucket: '6omedia',
					env_aws_access_key: '',
					env_aws_secret_key: ''
				}
			}

		};

3) 

	Set whether or not file uploads use aws in public/js/admin.js
	const useAws = true;

things to improve...

	Medium Things (v4)
		DONE - Meta description
		DONE - Schema markup
		DONE - favicon
		- content blocks
		DONE - pagination (both front and backend)
		- taxonomies on posts make collapsable
		- posts filter on back end
		- search functionality

	Big Things
		- Media Uploader (Manage images from the server, or select images for use on posts allready on the server)
		- full site backup (download)
		
	Maybe Things
		- Add post types (branch off from cms.. maybe new project called Blog CMS)


///// Adding new post type /////

1. Add new model in models
2. Add...

	var PostType = require('../models/{postType}');

	... in routes/main.js
		   routes/admin.js
		   routes/api.js

3. Add to side menu in admin layout
4. Setup routes in admin.js
	/postTypes
	/postType/new
	/postType/:id
5. Add Templates
	admin_{posttype}.pug
	admin_{posttype}_new.pug
	admin_{posttype}_edit.pug
6. In admin_layout.pug add at the bottom where the scripts are called...
	when 'postType'
			script(src='/static/js/admin/admin_{postType}.js')


... add permissions

/////////////// TO DO //////////////////

- Add username to posts and videos













/*******************************
	User Roles
********************************/

// Back end roles...
	// These can access the backend

SUPERADMIN:
	The first user added when set up and can't be deleted. 
        There is only one superadmin.

ADMIN:
	Should be able to manage most/all things.

// Front end roles...
	// these can not access any part of the backend

SUBSCRIBER:
	A user that has signed up to the site and can access their 
	profile/account... etc but not the admins backend and an 
	manage nothing in the backend.

VISITOR: 
	Has no involvement whatso ever should have no permissions.
	A visitor is just someone who views the site but has been tracked.



/***********************************************

	MongoDB users setup

************************************************/  

use admin

db.createUser(
  {
    user: "mongoadmin",
    pwd: "mongoadmin",
    roles: [
    	{ role: 'root', db: "admin"}
    ]
  }
)

// login as mongoadmin...

use cms

db.createUser(
  {
    user: "mongoadmin",
    pwd: "mongoadmin",
    roles: [
    	{ role: 'root', db: "admin"}
    ]
  }
)


//// Article Schema Markup ////


<span itemscope itemtype="http://schema.org/Article"><h1 itemprop="name">article name</h1>

<p>Posted on 
<span itemprop="datePublished" content="2016-09-09">9th September 2016</span></p>
<p>
	by 
	<span itemprop="author" itemscope itemtype="http://schema.org/Person">
		<span itemprop="name">
			someone yeah
		</span>
	</span>
</p>
<div>
<img itemprop="image" src="http://njdckscnkl.com"/>
<p itemprop="articleBody">ncdjksc xjksd xcjksd c xz</p>
</div>

</span>