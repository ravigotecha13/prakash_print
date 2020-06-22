const express = require('express');
const router = express.Router();
const Nnewslive = require('../models/newslive');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Nnewslive
    .where({user})
    .populate('bookings')
    .exec(function(err, foundNnewslives) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNnewslives);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Nnewslive
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundNnewslive) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundNnewslive.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not newslive owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const newsliveId = req.params.id;

  Nnewslive.findById(newsliveId)
        .exec(function(err, foundNnewslive) {

    if (err || !foundNnewslive) {
      return res.status(422).send({errors: [{title: 'Nnewslive Error!', detail: 'Could not find Nnewslive!'}]});
    }

    return res.json(foundNnewslive);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var newsliveData = {};
      newsliveData.city = req.body.city;
      newsliveData.url = req.body.url;

  Nnewslive
    .findById(req.params.id)
    .exec(function(err, foundNnewslive) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundNnewslive.set(newsliveData);
      foundNnewslive.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundNnewslive);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {

  Nnewslive
    .findById(req.params.id)
    .exec(function(err, foundNnewslive) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundNnewslive.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { city,url} = req.body;


  const newslive = new Nnewslive({city,url});
  Nnewslive.create(newslive, function(err, newNnewslive) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    return res.json(newNnewslive);
  });
});

router.get('', function(req, res) {
  // const city = req.query.city;
  // const query = city ? {city: city.toLowerCase()} : {};
  const query = {};
  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};

   Nnewslive.count().exec(function(err,totalCount){
    Nnewslive.find().populate('city').limit(query.limit).skip(query.skip).then(function(foundNnewslives) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Newslive Found Successfully',data:foundNnewslives,pages:totalPages});
      });
    });
});
module.exports = router;


