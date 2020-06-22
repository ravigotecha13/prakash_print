const express = require('express');
const router = express.Router();
const CompetitiveExam = require('../models/competitiveexam');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  CompetitiveExam
    .where({user})
    .populate('bookings')
    .exec(function(err, foundCompetitiveExams) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundCompetitiveExams);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  CompetitiveExam
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundCompetitiveExam) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundCompetitiveExam.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not competitiveexam owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const competitiveexamId = req.params.id;

  CompetitiveExam.findById(competitiveexamId)
        .exec(function(err, foundCompetitiveExam) {

    if (err || !foundCompetitiveExam) {
      return res.status(422).send({errors: [{title: 'CompetitiveExam Error!', detail: 'Could not find CompetitiveExam!'}]});
    }

    return res.json(foundCompetitiveExam);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var competitiveexamData = {};
console.log(competitiveexamData);
competitiveexamData.type=req.body.type;
if(req.body.image !='' && typeof req.body.image !='undefined' && req.body.type=='study'){

  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
      competitiveexamData.file=filename;

competitiveexamData.url='';
}
if(req.body.url !='' && typeof req.body.url !='undefined' && req.body.type=='video'){
      competitiveexamData.url=req.body.url;
competitiveexamData.file='';

}


  CompetitiveExam
    .findById(req.params.id)
    .exec(function(err, foundCompetitiveExam) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundCompetitiveExam.set(competitiveexamData);
      foundCompetitiveExam.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundCompetitiveExam);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  CompetitiveExam
    .findById(req.params.id)
    .exec(function(err, foundCompetitiveExam) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundCompetitiveExam.remove(function(err) {
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

const competitiveexam = new CompetitiveExam({type});
competitiveexam.file='';
competitiveexam.url='';

if(req.body.image !='' && typeof req.body.image !='undefined'){

  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
      competitiveexam.file=filename;

}
if(req.body.url !='' && typeof req.body.url !='undefined'){
      competitiveexam.url=req.body.url;
}
//console.log(req.body);
console.log(competitiveexam);
//return false;

  CompetitiveExam.create(competitiveexam, function(err, newCompetitiveExam) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {competitiveexams: newCompetitiveExam}}, function(){});

    return res.json(newCompetitiveExam);
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
   CompetitiveExam.count().exec(function(err,totalCount){

    CompetitiveExam.find({},{},query,function(err, foundCompetitiveExams) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundCompetitiveExams.length === 0) {
          return res.status(422).send({errors: [{title: 'No CompetitiveExams Found!', detail: `There are no competitiveexams for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'CompetitiveExam Found Successfully',data:foundCompetitiveExams,pages:totalPages});
      });
    });
});
module.exports = router;


