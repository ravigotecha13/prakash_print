const express = require('express');
const router = express.Router();
const Advertise = require('../models/advertise');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Advertise
    .where({user})
    .populate('bookings')
    .exec(function(err, foundAdvertises) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundAdvertises);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Advertise
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundAdvertise) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundAdvertise.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not advertise owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const advertiseId = req.params.id;

  Advertise.findById(advertiseId)
        .exec(function(err, foundAdvertise) {

    if (err || !foundAdvertise) {
      return res.status(422).send({errors: [{title: 'Advertise Error!', detail: 'Could not find Advertise!'}]});
    }

    return res.json(foundAdvertise);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var advertiseData = {};
advertiseData.url = req.body.url;
console.log(advertiseData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
advertiseData.image = filename;

}

  Advertise
    .findById(req.params.id)
    .exec(function(err, foundAdvertise) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundAdvertise.set(advertiseData);
      foundAdvertise.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundAdvertise);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Advertise
    .findById(req.params.id)
    .exec(function(err, foundAdvertise) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundAdvertise.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {

var filename = '',filename1 = '',filename2='';
if(typeof req.body.leftimage !="" && req.body.section =='left-bottom'){

var img= req.body.leftimage,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
}
if(typeof req.body.bottomimage !="" && req.body.section =='left-bottom'){
var img= req.body.bottomimage,extantion=img.split(";")[0].split("/")[1],filename1=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename1, buff, function (err) { console.log('done'); });

}
if(req.body.bottomimage !="" && req.body.section =='slider'){
var img= req.body.sliderimage,extantion=img.split(";")[0].split("/")[1],filename2=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename2, buff, function (err) { console.log('done'); });

}

  const advertise = new Advertise();
      advertise.leftimage=filename;
      advertise.bottomimage=filename1;
      advertise.sliderimage=filename2;
      advertise.type=req.body.section;
      advertise.name=req.body.name;
      advertise.url=req.body.url;
      advertise.pagetype=req.body.pagetype;
      if(req.body.pagetype =='Directory'){
        advertise.city=req.body.city;
        advertise.isCategory="";
        if(req.body.category =='All'){
          advertise.isCategory=req.body.isCategory;
        }else{
          advertise.category=req.body.category;
        }
      }

  Advertise.create(advertise, function(err, newAdvertise) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {advertises: newAdvertise}}, function(){});

    return res.json(newAdvertise);
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  var searchquery = {};
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};
  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'type':{$regex: '(?i)'+req.query.search}},{'name':{$regex: '(?i)'+req.query.search}},{'pagetype':{$regex: '(?i)'+req.query.search}}]}; 
  }

Advertise.find(searchquery)
    .limit(query.limit)
    .populate('city category')
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundAdvertises) {
     return   Advertise.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
     console.log(err);
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundAdvertises.map(function(foundAdvertises){
          return foundAdvertises.toJSONFor(foundAdvertises);
        }),

            })
        }) //.catch(next);
    })//.catch(next);


   // Advertise.count().exec(function(err,totalCount){
   //  Advertise.find().populate('city category').sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundAdvertises) {
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Records Found Successfully',data:foundAdvertises,pages:totalPages});
   //    });
   //  });

   // Advertise.count().exec(function(err,totalCount){

   //  Advertise.find({},{},query,function(err, foundAdvertises) {
   //      if (err) {
   //        return res.status(422).send({errors: normalizeErrors(err.errors)});
   //      }

   //      if (city && foundAdvertises.length === 0) {
   //        return res.status(422).send({errors: [{title: 'No Advertises Found!', detail: `There are no advertises for city ${city}`}]});
   //      }
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Advertise Found Successfully',data:foundAdvertises,pages:totalPages});
   //    });
   //  });
});


router.post('/allslider',   function(req, res) {
    const query = {};

    // query.type = 'slider';
    query.pagetype = req.body.page;
    if(query.pagetype =='Directory'){
      Advertise.find(query).sort({createdAt: -1}).then(function(foundSlider) {
          return res.json({error:false,message:'Directory Found Successfully',data:foundSlider});
      });
    }else if(query.pagetype =='Exit'){
      Advertise.find(query).sort({createdAt: -1}).limit(1).then(function(foundSlider) {
          return res.json({error:false,message:'Directory Found Successfully',data:foundSlider});
      });
    }else{
      query.pagetype = {$in : [req.body.page,'Exit']};
      Advertise.find(query).sort({createdAt: -1}).then(function(foundSlider) {
          return res.json({error:false,message:'Slider Found Successfully',data:foundSlider});
      });

    }
});

router.post('/allyoutube',   function(req, res) {
    Advertise.find({type :'left-bottom'}).sort({createdAt: -1}).then(function(foundSlider) {
        return res.json({error:false,message:'Slider Found Successfully',data:foundSlider});
    });
});


module.exports = router;


