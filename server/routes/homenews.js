const express = require('express');
const router = express.Router();
const Homenews = require('../models/homenews');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './assets/public/' });
const FCM = require('fcm-node')
const serverKey = require('../helpers/privatekey.json') //put the generated private key path here    
var fcm = new FCM(serverKey);    

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',   function(req, res) {
  const user = res.locals.user;

  Homenews
    .where({user})
    .populate('bookings')
    .exec(function(err, foundHomenews) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundHomenews);
  });
});

router.get('/allnews1', function(req, res) {
console.log('12122121');
    Homenews.find().sort({createdAt: 'desc'}).then(function(foundHomenewss) {
      console.log('121221');
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss});
    });
});



router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Homenews
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundHomenews) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundHomenews.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not homenews owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const homenewsId = req.params.id;

  Homenews.findById(homenewsId)
        .exec(function(err, foundHomenews) {

    if (err || !foundHomenews) {
      return res.status(422).send({errors: [{title: 'Homenews Error!', detail: 'Could not find Homenews!'}]});
    }

    return res.json(foundHomenews);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var homenewsData = {};
homenewsData.agency = req.body.agency;
console.log(homenewsData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
homenewsData.image = filename;

}

  Homenews
    .findById(req.params.id)
    .exec(function(err, foundHomenews) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundHomenews.set(homenewsData);
      foundHomenews.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundHomenews);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Homenews
    .findById(req.params.id)
    .exec(function(err, foundHomenews) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundHomenews.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  multipartMiddleware,function(req, res) {
  const { agency} = req.body;



 // var message = { 
 //        to: '', 
 //        collapse_key: 'your_collapse_key',
 //        // notification: {
 //        //     type : '1',
 //        //     message: 'Hello this is demo ',
 //        //     title: 'Title of your push notification', 
 //        //     body: 'Body of your push notification' 
 //        // },
 //        data: {  //you can send only notification or only data(or include both)
 //            type: '1',
 //            title: 'my another value'
 //        }
 //    }




 //    fcm.send(message, function(err, response){
 //        if (err) {
 //            console.log("Something has gone wrong!")
 //        } else {
 //            console.log("Successfully sent with response: ", response)
 //        }
 //    })

 //    return res.json({error:false,message:'Record Added Successfully'});
 


/*** Demo **/




var imageslist='';
var img= req.files.uploads;
var j =0 ;
var objlist = [];



for(var i=0;i<img.length;i++){


// var extantion=img[i].img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

// imageslist=filename;
// var buff = new Buffer(img[i].img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

// fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
console.log(img[i].path);
objlist.push({'agency':agency,image :img[i].path.split('/')[2],name:img[i].name}); 

 j = j + 1;
}


console.log(j);
console.log(img.length);

if(j == img.length){
  console.log(objlist);
 Homenews.create(objlist, function(err, newNewspaper) {
  console.log(newNewspaper);
  /// Notification 
 
  User.find().then(function(foundUsers) {
    var tokenlist = [];
    var checkagency = '1';
    if(req.body.agency == 'kd'){
      checkagency = '2';      
    }
    console.log(req.body.agency);
        // tokenlist.push('du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L');
        // tokenlist.push('cuLeoVzULEY:APA91bHIQcGSDiTb4fXY8hYlgDJqdvzZi8UYTN5Zq3tiBzJ8o02h3ftLay0gUIkizfQTrfslfmEjwWjVU8cZWwVR5kFhvzVdb4DB2-RtHrva7S95pTfMrE-ZbnLTJACshEs1jo2yuNzv');

      for(var i=0;i <foundUsers.length;i++){

            if(foundUsers[i].fcmtoken !=='' && foundUsers[i].fcmtoken !=null){
//              tokenlist.push(foundUsers[i].fcmtoken);

            $noti = {};
            if(foundUsers[i].deviceType == "ios"){
               $noti ={
                        type: checkagency,
                        title: 'Today '+req.body.agency+' Uploaded'
                    }
             }


 var message = { 
        to: foundUsers[i].fcmtoken,// 'du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L', 
        notification : $noti,

        data: {  //you can send only notification or only data(or include both)
            type: checkagency,
            title: 'Today '+req.body.agency+' Uploaded'
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


  });    

    return res.json({error:false,message:'Record Added Successfully'});
  });
}
//    return res.json(newHomenews);
//imageslist = imageslist.slice(0, -1);

  
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};

   Homenews.count({
    "createdAt": 
    {
        $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
    }

    }).exec(function(err,totalCount){
    Homenews.find({
    "createdAt": 
    {
        $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
    }

    }).populate('city').limit(query.limit).skip(query.skip).sort({'_id': 'desc'}).then(function(foundHomenewss) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss,pages:totalPages});
      });
    });
});


router.post('/allnews',   function(req, res) {

/*{
    "createdAt": 
    {
        $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))
    }

    }*/
    Homenews.find({
    "createdAt": 
    {
        $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
    }

    }).sort({'_id': 'desc'}).then(function(foundHomenewss) {
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss});
    });
});

router.post('/update',   function(req, res) {

  const id = req.body.id;
  var homeData = {};
  homeData.createdAt = req.body.date;


  Homenews
    .findById(id)
    .exec(function(err, foundhome) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundhome.set(homeData);
      foundhome.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundhome);
      });
    });

});


router.post('/upload',  multipartMiddleware,function(req, res) {
  const { agency} = req.body;

var img= req.files.image;
var objlist = [];
objlist.push({'agency':agency,image :img.path.split('/')[2],name:img.name}); 

    Homenews.create(objlist, function(err, newNewspaper) {

        return res.json({error:false,message:'Record Added Successfully'});


    });


});

router.post('/sendnotification',  multipartMiddleware,function(req, res) {
  const { agency} = req.body;




  User.find().then(function(foundUsers) {
    var tokenlist = [];
    var checkagency = '1';
    if(req.body.agency == 'kd'){
      checkagency = '2';      
    }
    console.log(req.body.agency);
        // tokenlist.push('du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L');
        // tokenlist.push('cuLeoVzULEY:APA91bHIQcGSDiTb4fXY8hYlgDJqdvzZi8UYTN5Zq3tiBzJ8o02h3ftLay0gUIkizfQTrfslfmEjwWjVU8cZWwVR5kFhvzVdb4DB2-RtHrva7S95pTfMrE-ZbnLTJACshEs1jo2yuNzv');

      for(var i=0;i <foundUsers.length;i++){

            if(foundUsers[i].fcmtoken !=='' && foundUsers[i].fcmtoken !=null){
              tokenlist.push(foundUsers[i].fcmtoken);
          $noti = {};
            if(foundUsers[i].deviceType == "ios"){
               $noti ={
                        type: checkagency,
                        title: 'Today '+req.body.agency+' Uploaded'
                    }
             }


console.log('1i =------------------ i');
 var message = { 
        to: foundUsers[i].fcmtoken,// 'du3hCxRftXQ:APA91bGcukbd16kF-nlD1Xc-zg96VcqmHLCxYLVGuPNuL0UVW-n80b5jCmzwJoj0i3suGALrbXvjblqDrnJACEG-xI56QTPS2k0IVlq6-fjFa7FO3eYTVW2lp5O8iNgNbvCey2k2pj8L', 
        notification : $noti,        
        data: {  //you can send only notification or only data(or include both)
            type: checkagency,
            title: 'Today '+req.body.agency+' Uploaded '
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

    return res.json({error:false,message:'Nofication Send Successfully'});

  });    












});




module.exports = router;


