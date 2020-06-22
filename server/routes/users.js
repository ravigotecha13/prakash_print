const express = require('express');
const Users = require('../controllers/user');
const Pressnote = require('../models/pressnote');
const Blood = require('../models/blood');
const Direcotry = require('../models/directory');
const Videoad = require('../models/videoad');
const router = express.Router();
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

//router.get('/:id', Users.authMiddleware, Users.getUser);
router.get('/getall', function(req, res) {

    User.find({},{_id:0,__v:0,fcmtoken:0,password:0,email:0}).sort({ 'createdAt':'desc'}).exec(function(err, foundUsers) {
      console.log(err);
        return res.json({error:false,message:'Users Found Successfully',data:foundUsers});
    });
});
router.get('/getalldata', function(req, res) {

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    User.count({createdAt: {$gte: today}}).exec(function(err, foundUsers){

       Pressnote.count({createdAt: {$gte: today},'type':{'$nin':['history','video']}}).exec(function(err,pressnoteCount){

          Direcotry.count({createdAt: {$gte: today}}).exec(function(err,directoryCount){

            Blood.count({createdAt: {$gte: today}}).exec(function(err,bloodCount){

              Pressnote.count({createdAt: {$gte: today},'type':{'$in':['history']}}).exec(function(err,historyCount){

                Videoad.count({createdAt: {$gte: today}}).exec(function(err,videoCount){

                return res.json({error:false,message:'Data Found Successfully',users:foundUsers,pressnote : pressnoteCount,directory:directoryCount,blood:bloodCount,history:historyCount,video:videoCount});
  
                });

              });

            });
  
          });

       });
  
    });
});

router.delete('/:id', function(req, res) {
  const user = res.locals.user;

  User
    .findById(req.params.id)
    .exec(function(err, foundUsers) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundUsers.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
  });

router.post('/auth', Users.auth);

router.post('/register', Users.register);


router.post('/add',  function(req, res) {
  const { name,mobileno,patname,city,fcmtoken,deviceType} = req.body;

  //const user = new User({name,mobileno,email,city});


return	User.findOne({mobileno}, function(err, existingUser1) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingUser1) {
        var userData = {}
        userData.name = req.body.name;
        userData.patname = req.body.patname;
        userData.city = req.body.city;
        userData.fcmtoken = req.body.fcmtoken;
        userData.deviceType = 'ios';

        if(req.body.deviceType !=null && req.body.deviceType !=''){
          userData.deviceType = req.body.deviceType;
        }
console.log(userData);
      existingUser1.set(userData);
    return  existingUser1.save(function(err) {

      	  return res.json({error:false,message:'User Updated Successfully',data:existingUser1});
      });
//      return res.status(422).send({errors: true, [{title: 'Invalid email!', detail: 'User with this email already exist!'}]});
    }

		const user = new User({name,mobileno,patname,city,fcmtoken,deviceType});
	    // const user = new User({
	    //   username,
	    //   email,
	    //   password
	    // });
        user.deviceType = 'ios';

        if(req.body.deviceType !=null && req.body.deviceType !=''){
          user.deviceType = req.body.deviceType;
        }

return  User.create(user, function(err, newUser) {
  
    if (err) {
    return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    return res.json({error:false,message:'User Added Successfully',data:newUser});
  });

	    // user.save(function(err) {
	    //   if (err) {
	    //     return res.status(422).send({errors: normalizeErrors(err.errors)});
	    //   }

		   //  return res.json({error:false,message:'User Added Successfully',data:newUser});
	    // //  return res.json({'registered': true});
	    // })
	  })
	

















  User.create(user, function(err, newUser) {
    if (err) {
console.log(err.Mongoerror);

    // for (let property in errors) {
    //   if (errors.hasOwnProperty(property)) {
    //     normalizeErrors.push({title: property, detail: errors[property].message});
    //   }
    // }


  	  return res.json({error:true,message:'Email Address Already Exists'});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json({error:false,message:'User Added Successfully',data:newUser});
  });
});
router.get('/:id', function(req, res) {
  const userId = req.params.id;

  User.findById(userId)
        .exec(function(err, foundUser) {
    if (err || !foundUser) {
      return res.status(422).send({errors: [{title: 'User Error!', detail: 'Could not find Notification!'}]});
    }

    return res.json(foundUser);
  });
});

router.patch('/:id', function(req, res) {

  var userData = {};
      userData.email = req.body.email;
      if(req.body.password !="" && req.body.password !=null){
        userData.password = req.body.password;
      }

  User
    .findById(req.params.id)
    .exec(function(err, foundUser) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundUser.set(userData);
      foundUser.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundUser);
      });
    });
});


router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};
  var searchquery = {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};
  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'name':{$regex: '(?i)'+req.query.search}},{'mobileno':{$regex: '(?i)'+req.query.search}},{'patname':{$regex: '(?i)'+req.query.search}},{'city':{$regex: '(?i)'+req.query.search}}]}; //{$or: [{'name': new RegExp('^' + req.query.search+'$')}]}; //"$regex":"/^"+req.query.jobtitle+"/"};
  }

    User.find(searchquery)
//    .select('name')
    .limit(query.limit)
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundUsers) {
     return   User.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
      return  res.json({
          error: false,
          pages: totalPages,
          totalRecord: count,
          data: foundUsers.map(function(foundUsers){
          return foundUsers.toJSONFor(foundUsers);
        }),

            })
        }) //.catch(next);
    })//.catch(next);


   // User.count().exec(function(err,totalCount){

   //  User.find({},{},query,function(err, foundUsers) {
   //      if (err) {
   //        return res.status(422).send({errors: normalizeErrors(err.errors)});
   //      }

   //      if (city && foundAgencys.length === 0) {
   //        return res.status(422).send({errors: [{title: 'No Users Found!', detail: `There are no users for city ${city}`}]});
   //      }
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Users Found Successfully',data:foundUsers,pages:totalPages});
   //    });
   //  });
});

module.exports = router;


