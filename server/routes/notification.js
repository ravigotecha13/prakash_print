const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
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

  Notification
    .where({user})
    .populate('bookings')
    .exec(function(err, foundNotifications) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNotifications);
  });
});
router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  Notification.find().exec(function(err, foundNotification) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNotification);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Notification
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundNotification) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundNotification.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not notification owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const notificationId = req.params.id;

  Notification.findById(notificationId)
        .exec(function(err, foundNotification) {

    if (err || !foundNotification) {
      return res.status(422).send({errors: [{title: 'Notification Error!', detail: 'Could not find Notification!'}]});
    }

    return res.json(foundNotification);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var notificationData = {};
notificationData.url = req.body.url;
console.log(notificationData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
notificationData.image = filename;

}

  Notification
    .findById(req.params.id)
    .exec(function(err, foundNotification) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundNotification.set(notificationData);
      foundNotification.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundNotification);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Notification
    .findById(req.params.id)
    .exec(function(err, foundNotification) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundNotification.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {

var filename = '';
var title = '',description ='';
if(req.body.image !=""  && req.body.image !=null){

var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
}

if(req.body.title !='' && req.body.title !=null && req.body.description !='' && req.body.description !=null){
 title =req.body.title;  
 description =req.body.description;  
}

  const notification = new Notification();
      notification.image=filename;
      notification.title=title;
      notification.description=description;
  Notification.create(notification, function(err, newNotification) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    if(filename ==""){
      var notificationimage ="";
    }else{
      var notificationimage = "http://159.65.150.17/assets/public/"+filename;

    }

  User.find().then(function(foundUsers) {
    var tokenlist = [];
  
      for(var i=0;i <foundUsers.length;i++){

            if(foundUsers[i].fcmtoken !=='' && foundUsers[i].fcmtoken !=null){
              tokenlist.push(foundUsers[i].fcmtoken);
              $noti = {};
              if(foundUsers[i].deviceType == "ios"){
                 $noti ={
                              type : '4',
                              title: req.body.title, 
                              body: req.body.description,
                              image: notificationimage,
                            }
                          

              }


         var message = { 
                to: foundUsers[i].fcmtoken,// 'du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L', 
               notification : $noti,
//                 notification: {
//                       type : '4',
//                       title: req.body.title, 
//                       body: req.body.description,
//                       image: notificationimage,
// //                      notification_type : '4',
//                   },
                data: {  //you can send only notification or only data(or include both)
                //     type: 3,
                //     title: 

                      type : '4',
                      title: req.body.title, 
                      body: req.body.description,
                      image: notificationimage

                },
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


  });    




























    return res.json(newNotification);
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};

   Notification.count().exec(function(err,totalCount){

    Notification.find({},{},query,function(err, foundNotifications) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundNotifications.length === 0) {
          return res.status(422).send({errors: [{title: 'No Notifications Found!', detail: `There are no notifications for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Notification Found Successfully',data:foundNotifications,pages:totalPages});
      });
    });
});

router.post('/getall', function(req, res) {


  Notification.find().sort({'createdAt':'desc'}).exec(function(err, foundNotifications) {

    if(foundNotifications.length == 0){
      return res.json({error:true,message:'Notification Not Found '});
    }else{
        return res.json({error:false,message:'Notification Found Successfully',data:foundNotifications});

    }

  });

});

module.exports = router;


