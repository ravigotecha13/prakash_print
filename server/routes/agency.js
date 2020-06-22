const express = require('express');
const router = express.Router();
const Agency = require('../models/agency');
const Newspaper = require('../models/newspaper');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Agency
    .where({user})
    .populate('bookings')
    .exec(function(err, foundAgencys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundAgencys);
  });
});
router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  Agency.find().exec(function(err, foundAgency) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundAgency);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Agency
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundAgency) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundAgency.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not agency owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const agencyId = req.params.id;

  Agency.findById(agencyId)
        .exec(function(err, foundAgency) {

    if (err || !foundAgency) {
      return res.status(422).send({errors: [{title: 'Agency Error!', detail: 'Could not find Agency!'}]});
    }

    return res.json(foundAgency);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var agencyData = {};
agencyData.url = req.body.url;
console.log(agencyData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
agencyData.image = filename;

}

  Agency
    .findById(req.params.id)
    .exec(function(err, foundAgency) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundAgency.set(agencyData);
      foundAgency.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundAgency);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Agency
    .findById(req.params.id)
    .exec(function(err, foundAgency) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundAgency.remove(function(err) {
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

  const agency = new Agency();
      agency.image=filename;
      agency.name=req.body.name;
  Agency.create(agency, function(err, newAgency) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(newAgency);
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

   Agency.count().exec(function(err,totalCount){

    Agency.find({},{},query,function(err, foundAgencys) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundAgencys.length === 0) {
          return res.status(422).send({errors: [{title: 'No Agencys Found!', detail: `There are no agencys for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Agency Found Successfully',data:foundAgencys,pages:totalPages});
      });
    });
});

router.post('/getall', function(req, res) {


  Newspaper.find().populate('agency').exec(function(err, foundAgencys) {

    var tmpcate = [];
    for(var i=0; i<foundAgencys.length;i++){

        if(tmpcate.indexOf(foundAgencys[i]['agency']) === -1 ){
          tmpcate.push(foundAgencys[i]['agency']);
        }
    }
    if(tmpcate == ''){
      return res.json({error:true,message:'Agency Not Found '});
    }else{
        return res.json({error:false,message:'Agency Found Successfully',data:tmpcate});

    }

  });

});

module.exports = router;


