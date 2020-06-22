const express = require('express');
const router = express.Router();
const Division = require('../models/division');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Division
    .where({user})
    .populate('bookings')
    .exec(function(err, foundDivisions) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundDivisions);
  });
});

router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  Division.find().exec(function(err, foundDivisions) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundDivisions);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Division
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundDivision) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundDivision.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not division owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const divisionId = req.params.id;

  Division.findById(divisionId)
        .exec(function(err, foundDivision) {

    if (err || !foundDivision) {
      return res.status(422).send({errors: [{title: 'Division Error!', detail: 'Could not find Division!'}]});
    }

    return res.json(foundDivision);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var divisionData = {};
      divisionData.name = req.body.name
      divisionData.subname = req.body.subname;

  Division
    .findById(req.params.id)
    .exec(function(err, foundDivision) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundDivision.set(divisionData);
      foundDivision.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundDivision);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Division
    .findById(req.params.id)
    .exec(function(err, foundDivision) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundDivision.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { name,subname} = req.body;


  const division = new Division({name,subname});
  Division.create(division, function(err, newDivision) {
console.log(err);
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(newDivision);
  });
});

router.get('', function(req, res) {
  const division = req.query.division;
  const query = division ? {division: division.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};

   Division.count().exec(function(err,totalCount){

    Division.find({},{},query,function(err, foundDivisions) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (division && foundDivisions.length === 0) {
          return res.status(422).send({errors: [{title: 'No Divisions Found!', detail: `There are no divisions for division ${division}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Division Found Successfully',data:foundDivisions,pages:totalPages});
      });
    });
});
module.exports = router;


