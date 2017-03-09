
var express = require('express');

const aws = require('aws-sdk');
// const aws = require('aws4');
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

var cms_api = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../../models/user');
var Post = require('../../models/post');
var Taxonomy = require('../../models/taxonomy');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var uuid = require('node-uuid');
var mid = require('../../middleware');

// aws settings

/* Posts */

cms_api.post('/add_post', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    const post = new Post(
        {
            title: req.body.title,
            slug: req.body.slug,
            body: req.body.body,
            taxonomies: JSON.parse(req.body.categories),
            feat_img: req.body.feat_img,
            user_id: req.body.user_id,
            user_name: req.body.user_name,
            date: req.body.date
        }
    );

    //save model to MongoDB
    post.save(function (err) {

        if(err) {
            data.error = err;
            res.send(data);
        }else{
            data.success = '1';
            res.send(data);
        }

    });

});

cms_api.post('/update_post', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    const postid = req.body.postid;

    Post.update(
        {
        "_id": postid
        }, 
        {
            $set: {
                title: req.body.title,
                slug: req.body.slug,
                body: req.body.body,
                taxonomies: JSON.parse(req.body.categories),
                feat_img: req.body.feat_img
            }
        },
        function(err, affected, resp){
            if(err){
                data.error = err;
                res.send(data);
            }else{
                data.success = '1';
                res.send(data);
            }
        }
    );

});

// cms_api.post('/add_taxonomy', mid.checkUserAdmin, function(req, res, next){

//     let data = {};
//     data.success = '0';
    
//     const taxonomy = new Taxonomy(
//         {
//           taxonomy_name: req.body.name,
//           taxonomy_description: req.body.description
//         }
//     );

//     //save model to MongoDB
//     taxonomy.save(function (err, taxonomy) {

//         if(err) {
//             data.error = err;
//             res.send(data);
//         }else{
//             data.success = '1';
//             data.catname = taxonomy.taxonomy_name; 
//             data.catid = taxonomy._id;
//             res.send(data);
//         }

//     });

// });

cms_api.post('/add_cat', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    
    const category = new Category(
        {
          name: req.body.name,
          description: req.body.description
        }
    );

    //save model to MongoDB
    category.save(function (err, cat) {

        if(err) {
            data.error = err;
            res.send(data);
        }else{
            data.success = '1';
            data.catname = cat.name; 
            data.catid = cat._id;
            res.send(data);
        }

    });

});

cms_api.post('/add_term', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    Taxonomy.findOneAndUpdate(
        {"taxonomy_name": req.body.taxonomy}, 
        {
            $push: {
                taxonomy_terms: {
                    term_name: req.body.name,
                    description: req.body.description,
                    parent: req.body.parent
                }
            }
        },
        { new: true }
    ).then(function (term) {
        // console.log('TERM: ', term.taxonomy_terms);

        data.catid = term.taxonomy_terms[term.taxonomy_terms.length - 1]._id;
        data.catname = term.taxonomy_terms[term.taxonomy_terms.length - 1].term_name;
        data.success = '1';

        res.send(data);
    });

    // Taxonomy.update(
    //     {
    //         "taxonomy_name": "Categories"
    //     }, 
    //     {
    //         $push: {
    //             taxonomy_terms: {
    //                 term_name: req.body.name,
    //                 description: req.body.description,
    //                 parent: req.body.parent
    //             }
    //         }
    //     },
    //     function(err, affected, resp){

    //         if(err){
    //             data.error = err;
    //             res.send(data);
    //         }else{
    //             if(affected.nModified){
    //                 data.catid = termId;
    //                 data.name = req.body.name,
    //                 data.success = '1';
    //             }
    //             res.send(data);
    //         }
    //     }
    // );

});

cms_api.post('/delete', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    
    const delete_item = req.body.delete_item;

    switch(delete_item){
        case 'post':

            Post.remove({ "_id" : req.body.itemid }, function(err){
              if(err){
                res.send(data);
              }else{
                data.success = '1';
                res.send(data);
              }
            });

        break;
        case 'taxonomy':

            Taxonomy.remove({ "_id" : req.body.itemid }, function(err, removed){
                data.removed = removed;
                if(err){
                    data.error = err;
                    res.send(data);
                }else{

                    if(removed){
                        data.success = '1';
                    }
                    
                    res.send(data);
                }
            });

        break;
        case 'term':

            // http://stackoverflow.com/questions/14244767/trying-to-remove-a-subdocument-in-mongoose-gives-me-an-internal-mongoose-error

            Taxonomy.findOneAndUpdate(
                {taxonomy_name: req.body.taxonomy_name}, 
                {$pull: 
                    {
                        taxonomy_terms: {
                            _id: req.body.itemid
                        }
                    }
                },
                function(err, org) {
                    // org contains the updated doc
                    if(err){
                        data.error = err;
                        res.send(data);
                    }else{
                        data.success = '1';
                        res.send(data);
                    }

                }
            );

        break;
        case 'user':

            User.findById({ "_id" : req.body.itemid }, function(err, theUser){

                if(err){
                    res.send(data);
                }else{

                    if(!theUser.isSuperAdmin){

                        User.remove({ "_id" : req.body.itemid }, function(err, removed){
                            data.removed = removed;
                            if(err){
                                data.error = err;
                                res.send(data);
                            }else{

                                if(removed){
                                    data.success = '1';
                                }
                                
                                res.send(data);
                            }
                        });

                    }else{
                        data.error = 'Can not delete a Super Admin';
                        res.send(data);
                    }

                }

            });

        break;
    }

});


cms_api.post('/add_user', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    const permissions = JSON.parse(req.body.permissions);

    console.log(req.body);

    // create obj with form input
    var userData = {
        ip: '',
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.user_role,
        // isadmin: req.body.isadmin,
        permissions: [{
            manage_posts: permissions[0].checked,
            manage_users: permissions[1].checked
        }]
    }

    // add to mongo db
    User.create(userData, function(error, user){
        if( error ){
            console.log('1', error);
            res.send(error);
        }else{
            data.success = '1';
            res.send(data);
        }
    });

});

cms_api.post('/update_user', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    const userid = req.body.userid;

    const permissions = JSON.parse(req.body.permissions);

    let updateObj = {};

    const changepassword = req.body.changepassword;

    if(changepassword == "true"){

        let hashedPassword = '';

        bcrypt.hash(req.body.password, 5, function(err, hash){

            if(err){
                data.error = err;
                res.send(data);
            }

            updateObj = {
                $set: {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: hash,
                    isadmin: req.body.isadmin,
                    permissions: [{
                        manage_posts: permissions[0].checked,
                        manage_users: permissions[1].checked
                    }]
                }
            };

            User.update({"_id": userid}, updateObj, function(err, affected, resp){

                if(err){
                    data.error = err;
                    res.send(data);
                }else{
                    data.success = '1';
                    res.send(data);
                }
            });

        });

    }else{

        updateObj = {
            $set: {
                fullname: req.body.fullname,
                email: req.body.email,
                isadmin: req.body.isadmin,
                permissions: [{
                    manage_posts: permissions[0].checked,
                    manage_users: permissions[1].checked
                }]
            }
        };

        User.update({"_id": userid}, updateObj, function(err, affected, resp){

            if(err){
                data.error = err;
                res.send(data);
            }else{
                // console.log(affected);
                data.success = '1';
                res.send(data);
            }
        });

    }

});

cms_api.post('/generate_s3_url', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    const imgName = req.body.imgName;

    var s3 = new aws.S3({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: 'eu-west-2',
        signatureVersion: 'v4'
    });

    var uploadPreSignedUrl = s3.getSignedUrl('putObject', {
        Bucket: S3_BUCKET,
        Key: imgName,
        ACL: 'authenticated-read',
        ContentType: 'binary/octet-stream'
        /* then add all the rest of your parameters to AWS puttObect here */
    });

    var downloadPreSignedUrl = s3.getSignedUrl('getObject', {
        Bucket: S3_BUCKET,
        Key: imgName,
        /* set a fixed type, or calculate your mime type from the file extension */
        ResponseContentType: 'image/jpeg'
        /* and all the rest of your parameters to AWS getObect here */
    });

    data.uploadPreSignedUrl = uploadPreSignedUrl;
    data.downloadPreSignedUrl = downloadPreSignedUrl;

    res.send(data);

});

// Image uploads local server

cms_api.post('/upload/:subfolder', mid.checkUserAdmin, function(req, res, next){

    const subFolder = req.params.subfolder;

    let data = {};
    data.success = '0';

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../public/uploads/' + subFolder);

    const fuid = uuid.v4();
    // console.log(test);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        // fs.rename(file.path, path.join(form.uploadDir, file.name));
        fs.rename(file.path, path.join(form.uploadDir, fuid + file.name));
        data.filename = fuid + file.name;
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        res.send('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.send(data);
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
            
});

module.exports = cms_api;