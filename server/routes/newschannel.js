const express = require('express');
const router = express.Router();
const Newschannel = require('../models/newschannel');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newschannel
    .where({user})
    .populate('bookings')
    .exec(function(err, foundNewschannels) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNewschannels);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newschannel
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundNewschannel) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundNewschannel.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not newschannel owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const newschannelId = req.params.id;

  Newschannel.findById(newschannelId)
        .exec(function(err, foundNewschannel) {

    if (err || !foundNewschannel) {
      return res.status(422).send({errors: [{title: 'Newschannel Error!', detail: 'Could not find Newschannel!'}]});
    }

    return res.json(foundNewschannel);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var newschannelData = {};
newschannelData.url = req.body.url;
console.log(newschannelData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
newschannelData.image = filename;

}

  Newschannel
    .findById(req.params.id)
    .exec(function(err, foundNewschannel) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundNewschannel.set(newschannelData);
      foundNewschannel.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundNewschannel);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newschannel
    .findById(req.params.id)
    .exec(function(err, foundNewschannel) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundNewschannel.remove(function(err) {
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


  const newschannel = new Newschannel({url});
      newschannel.image=filename
  Newschannel.create(newschannel, function(err, newNewschannel) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {newschannels: newNewschannel}}, function(){});

    return res.json(newNewschannel);
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

   Newschannel.count().exec(function(err,totalCount){

    Newschannel.find({},{},query,function(err, foundNewschannels) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (city && foundNewschannels.length === 0) {
          return res.status(422).send({errors: [{title: 'No Newschannels Found!', detail: `There are no newschannels for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Newschannel Found Successfully',data:foundNewschannels,pages:totalPages});
      });
    });
});


router.post('/allnewschannel',   function(req, res) {
    Newschannel.find().sort({createdAt: -1}).then(function(foundNews) {
        return res.json({error:false,message:'News Channel Found Successfully',data:foundNews});
    });
});


module.exports = router;


