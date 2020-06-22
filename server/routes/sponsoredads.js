const express = require('express');
const router = express.Router();
const Sponsoredads = require('../models/sponsoredads');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Sponsoredads
    .where({user})
    .populate('bookings')
    .exec(function(err, foundSponsoredadss) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundSponsoredadss);
  });
});
router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  Sponsoredads.find().exec(function(err, foundSponsoredads) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundSponsoredads);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Sponsoredads
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundSponsoredads) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundSponsoredads.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not sponsoredads owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const sponsoredadsId = req.params.id;

  Sponsoredads.findById(sponsoredadsId)
        .exec(function(err, foundSponsoredads) {

    if (err || !foundSponsoredads) {
      return res.status(422).send({errors: [{title: 'Sponsoredads Error!', detail: 'Could not find Sponsoredads!'}]});
    }

    return res.json(foundSponsoredads);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var sponsoredadsData = {};
sponsoredadsData.url = req.body.url;
console.log(sponsoredadsData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
sponsoredadsData.image = filename;

}

  Sponsoredads
    .findById(req.params.id)
    .exec(function(err, foundSponsoredads) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundSponsoredads.set(sponsoredadsData);
      foundSponsoredads.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundSponsoredads);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Sponsoredads
    .findById(req.params.id)
    .exec(function(err, foundSponsoredads) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundSponsoredads.remove(function(err) {
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
if(typeof req.body.image !="" ){

var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
}

  const sponsoredads = new Sponsoredads();
      sponsoredads.image=filename;
      sponsoredads.url=req.body.url;
  Sponsoredads.create(sponsoredads, function(err, newSponsoredads) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(newSponsoredads);
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

   Sponsoredads.count().exec(function(err,totalCount){

    Sponsoredads.find({},{},query,function(err, foundSponsoredadss) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundSponsoredadss.length === 0) {
          return res.status(422).send({errors: [{title: 'No Sponsoredadss Found!', detail: `There are no sponsoredadss for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Sponsoredads Found Successfully',data:foundSponsoredadss,pages:totalPages});
      });
    });
});

router.post('/getall', function(req, res) {


  Sponsoredads.find().sort({'createdAt':'desc'}).exec(function(err, foundSponsoredadss) {

    if(foundSponsoredadss.length == 0){
      return res.json({error:true,message:'Sponsoredads Not Found '});
    }else{
        return res.json({error:false,message:'Sponsoredads Found Successfully',data:foundSponsoredadss});

    }

  });

});

module.exports = router;


