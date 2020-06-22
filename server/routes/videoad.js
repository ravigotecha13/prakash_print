const express = require('express');
const router = express.Router();
const Videoad = require('../models/videoad');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");
const FCM = require('fcm-node')
const serverKey = require('../helpers/privatekey.json') //put the generated private key path here    
var fcm = new FCM(serverKey);    

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Videoad
    .where({user})
    .populate('bookings')
    .exec(function(err, foundVideoads) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundVideoads);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Videoad
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundVideoad) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundVideoad.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not videoad owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const videoadId = req.params.id;

  Videoad.findById(videoadId)
        .exec(function(err, foundVideoad) {

    if (err || !foundVideoad) {
      return res.status(422).send({errors: [{title: 'Videoad Error!', detail: 'Could not find Videoad!'}]});
    }

    return res.json(foundVideoad);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var videoadData = {};
videoadData.name = req.body.name;
videoadData.url = req.body.url;

  Videoad
    .findById(req.params.id)
    .exec(function(err, foundVideoad) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundVideoad.set(videoadData);
      foundVideoad.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundVideoad);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Videoad
    .findById(req.params.id)
    .exec(function(err, foundVideoad) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundVideoad.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { name,city,url} = req.body;


  const videoad = new Videoad({name,city,url});
  Videoad.create(videoad, function(err, newVideoad) {
console.log(err);
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }


  User.find().then(function(foundUsers) {
    var tokenlist = [];

      for(var i=0;i <foundUsers.length;i++){

            if(foundUsers[i].fcmtoken !=='' && foundUsers[i].fcmtoken !=null){
              tokenlist.push(foundUsers[i].fcmtoken);
   var message = { 
          to: foundUsers[i].fcmtoken,// 'du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L', 
          data: {  //you can send only notification or only data(or include both)
              type: '5',
              title: 'New Video Uploaded'
          }
      }

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
            console.log(err);
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
console.log('\n');

            }
      }

      console.log(tokenlist);
    return res.json({error:false,message:'Record Added Successfully'});


  });    


  });
});
router.post('/adddevice',  function(req, res) {
  const { name,city,url} = req.body;


  const videoad = new Videoad({name,city,url});
  Videoad.create(videoad, function(err, newVideoad) {
console.log(err);
    if (err) {
      return res.json({error:true,message:'Record Not Added'});
    }
    return res.json({error:false,message:'Video Ad Added Successfully',data:newBlood});
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  var searchquery = {};
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.sort = {'createdAt':'desc'};
  query.limit = size;


  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'name':{$regex: '(?i)'+req.query.search}}  ]}; 
  }

Videoad.find(searchquery)
    .limit(query.limit)
    .populate('city')
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundVideoad) {
     return   Videoad.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
     console.log(err);
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundVideoad.map(function(foundVideoad){
          return foundVideoad.toJSONFor(foundVideoad);
        }),

            })
        }) //.catch(next);
    })//.catch(next);



   // Videoad.count().exec(function(err,totalCount){
   //  Videoad.find().populate('city').limit(query.limit).skip(query.skip).then(function(foundVideoad) {
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Video Ads Found Successfully',data:foundVideoad,pages:totalPages});
   //    });
   //  });
});


router.post('/getall', function(req, res) {
  Videoad.find().populate('city').exec(function(err, foundBlood) {
console.log(foundBlood);
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json({error:false,message:'Video Ads Found Successfully',data:foundBlood});
  });

});


module.exports = router;


