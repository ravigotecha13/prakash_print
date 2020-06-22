const express = require('express');
const router = express.Router();
const Newslink = require('../models/newslink');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './assets/public/' });

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newslink
    .where({user})
    .populate('bookings')
    .exec(function(err, foundNewslinks) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNewslinks);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newslink
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundNewslink) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundNewslink.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not newslink owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const newslinkId = req.params.id;

  Newslink.findById(newslinkId)
        .exec(function(err, foundNewslink) {

    if (err || !foundNewslink) {
      return res.status(422).send({errors: [{title: 'Newslink Error!', detail: 'Could not find Newslink!'}]});
    }

    return res.json(foundNewslink);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var newslinkData = {};
newslinkData.name = req.body.name;
newslinkData.url = req.body.url;

  Newslink
    .findById(req.params.id)
    .exec(function(err, foundNewslink) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundNewslink.set(newslinkData);
      foundNewslink.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundNewslink);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newslink
    .findById(req.params.id)
    .exec(function(err, foundNewslink) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundNewslink.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',multipartMiddleware,  function(req, res) {
  const { name} = req.body;
console.log(req.files);
  const newslink = new Newslink({name});
  var img= req.files.uploads;
  var imageslist = img[0].path.split('/')[2];
  newslink.file=imageslist;

  var imageslist1 = img[1].path.split('/')[2];
  newslink.image=imageslist1;

  Newslink.create(newslink, function(err, newNewslink) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {newslinks: newNewslink}}, function(){});

    return res.json(newNewslink);
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;

   Newslink.count().exec(function(err,totalCount){

    Newslink.find({},{},query,function(err, foundNewslinks) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundNewslinks.length === 0) {
          return res.status(422).send({errors: [{title: 'No Newslinks Found!', detail: `There are no newslinks for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Newslink Found Successfully',data:foundNewslinks,pages:totalPages});
      });
    });
});


router.post('/getall', function(req, res) {
  Newslink.find().exec(function(err, foundBlood) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json({error:false,message:'Important Links Found Successfully',data:foundBlood});
  });

});


module.exports = router;


