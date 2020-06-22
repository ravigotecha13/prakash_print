const express = require('express');
const router = express.Router();
const Material = require('../models/material');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Material
    .where({user})
    .populate('bookings')
    .exec(function(err, foundMaterials) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundMaterials);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Material
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundMaterial) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundMaterial.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not material owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const materialId = req.params.id;

  Material.findById(materialId)
        .exec(function(err, foundMaterial) {

    if (err || !foundMaterial) {
      return res.status(422).send({errors: [{title: 'Material Error!', detail: 'Could not find Material!'}]});
    }

    return res.json(foundMaterial);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var materialData = {};
materialData.division=req.body.division;
materialData.type=req.body.type;
if(req.body.image !='' && typeof req.body.image !='undefined' && req.body.type=='study'){

  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
      materialData.previewimage=filename;
      materialData.url='';
}
if(req.body.file !='' && typeof req.body.file !='undefined' && req.body.type=='study'){

  var img= req.body.file,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
  materialData.file=filename;

}
if(req.body.url !='' && typeof req.body.url !='undefined' && req.body.type=='video'){
      materialData.url=req.body.url;
      materialData.previewimage='';

}


  Material
    .findById(req.params.id)
    .exec(function(err, foundMaterial) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundMaterial.set(materialData);
      foundMaterial.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundMaterial);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Material
    .findById(req.params.id)
    .exec(function(err, foundMaterial) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundMaterial.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { type,division} = req.body;

const material = new Material({type,division});
material.file='';
material.url='';
material.previewimage='';

if(req.body.image !='' && typeof req.body.image !='undefined'){

  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
  material.previewimage=filename;

}
if(req.body.file !='' && typeof req.body.file !='undefined'){

  var img= req.body.file,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

  fs.writeFile('.dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
  material.file=filename;

}

if(req.body.url !='' && typeof req.body.url !='undefined'){
      material.url=req.body.url;
}
//console.log(req.body);
console.log(material);
//return false;

  Material.create(material, function(err, newMaterial) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {materials: newMaterial}}, function(){});

    return res.json(newMaterial);
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

   Material.count().exec(function(err,totalCount){
    Material.find().populate('division').sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundMaterials) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Materials Found Successfully',data:foundMaterials,pages:totalPages});
      });
    });

});
module.exports = router;


