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
	also in app.js change the database name

2)
	
	Set correct database in app.js

3) 

	Set whether or not file uploads use aws in public/js/admin.js
	const useAws = true;
	set aws settings in routes/api.js

things to improve...

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



  

