const express = require('express');
const router = express.Router();
const Farmercorner = require('../models/farmercorner');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Farmercorner
    .where({user})
    .populate('bookings')
    .exec(function(err, foundFarmercorners) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundFarmercorners);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Farmercorner
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundFarmercorner) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundFarmercorner.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not farmercorner owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const farmercornerId = req.params.id;

  Farmercorner.findById(farmercornerId)
        .exec(function(err, foundFarmercorner) {

    if (err || !foundFarmercorner) {
      return res.status(422).send({errors: [{title: 'Farmercorner Error!', detail: 'Could not find Farmercorner!'}]});
    }

    return res.json(foundFarmercorner);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var farmercornerData = {};
farmercornerData.type=req.body.type;

if(req.body.file !='' && typeof req.body.file !='undefined' && req.body.type=='study'){

  var img= req.body.file,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
  farmercornerData.file=filename;

}
if(req.body.url !='' && typeof req.body.url !='undefined' && req.body.type=='video'){
      farmercornerData.url=req.body.url;
      farmercornerData.previewimage='';

}


  Farmercorner
    .findById(req.params.id)
    .exec(function(err, foundFarmercorner) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundFarmercorner.set(farmercornerData);
      foundFarmercorner.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundFarmercorner);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Farmercorner
    .findById(req.params.id)
    .exec(function(err, foundFarmercorner) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundFarmercorner.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { type} = req.body;

const farmercorner = new Farmercorner({type});
farmercorner.file='';
farmercorner.url='';

if(req.body.file !='' && typeof req.body.file !='undefined'){

  var img= req.body.file,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
  farmercorner.file=filename;

}

if(req.body.url !='' && typeof req.body.url !='undefined'){
      farmercorner.url=req.body.url;
}
//console.log(req.body);
console.log(farmercorner);
//return false;

  Farmercorner.create(farmercorner, function(err, newFarmercorner) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {farmercorners: newFarmercorner}}, function(){});

    return res.json(newFarmercorner);
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

   Farmercorner.count().exec(function(err,totalCount){
    Farmercorner.find().sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundFarmercorners) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Farmercorners Found Successfully',data:foundFarmercorners,pages:totalPages});
      });
    });

});
module.exports = router;


