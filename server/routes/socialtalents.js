const express = require('express');
const router = express.Router();
const Socialtalents = require('../models/socialtalent');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Socialtalents
    .where({user})
    .populate('bookings')
    .exec(function(err, foundSocialtalentss) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundSocialtalentss);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Socialtalents
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundSocialtalents) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundSocialtalents.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not socialtalents owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const socialtalentsId = req.params.id;

  Socialtalents.findById(socialtalentsId)
        .exec(function(err, foundSocialtalents) {

    if (err || !foundSocialtalents) {
      return res.status(422).send({errors: [{title: 'Socialtalents Error!', detail: 'Could not find Socialtalents!'}]});
    }

    return res.json(foundSocialtalents);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var socialtalentsData = {};
socialtalentsData.url = req.body.url;
console.log(socialtalentsData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
socialtalentsData.image = filename;

}

  Socialtalents
    .findById(req.params.id)
    .exec(function(err, foundSocialtalents) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundSocialtalents.set(socialtalentsData);
      foundSocialtalents.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundSocialtalents);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Socialtalents
    .findById(req.params.id)
    .exec(function(err, foundSocialtalents) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundSocialtalents.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { url} = req.body;

var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });


  const socialtalents = new Socialtalents({url});
      socialtalents.image=filename
  Socialtalents.create(socialtalents, function(err, newSocialtalents) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {socialtalentss: newSocialtalents}}, function(){});

    return res.json(newSocialtalents);
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

   Socialtalents.count().exec(function(err,totalCount){

    Socialtalents.find({},{},query,function(err, foundSocialtalentss) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundSocialtalentss.length === 0) {
          return res.status(422).send({errors: [{title: 'No Socialtalentss Found!', detail: `There are no socialtalentss for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Socialtalents Found Successfully',data:foundSocialtalentss,pages:totalPages});
      });
    });
});
module.exports = router;


