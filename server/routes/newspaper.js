const express = require('express');
const router = express.Router();
const Newspaper = require('../models/newspaper');
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

  Newspaper
    .where({user})
    .populate('bookings')
    .exec(function(err, foundNewspapers) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundNewspapers);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newspaper
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundNewspaper) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundNewspaper.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not newspaper owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const newspaperId = req.params.id;

  Newspaper.findById(newspaperId)
        .exec(function(err, foundNewspaper) {

    if (err || !foundNewspaper) {
      return res.status(422).send({errors: [{title: 'Newspaper Error!', detail: 'Could not find Newspaper!'}]});
    }

    return res.json(foundNewspaper);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var newspaperData = {};
newspaperData.agency = req.body.agency;
console.log(newspaperData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
newspaperData.image = filename;

}

  Newspaper
    .findById(req.params.id)
    .exec(function(err, foundNewspaper) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundNewspaper.set(newspaperData);
      foundNewspaper.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundNewspaper);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Newspaper
    .findById(req.params.id)
    .exec(function(err, foundNewspaper) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundNewspaper.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add', multipartMiddleware, function(req, res) {
  const { agency} = req.body;

var img= req.files.uploads;
var imageslist = img[0].path.split('/')[2];
console.log(imageslist);
// if(req.body.file != ''){

//   var img= req.body.file,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

//   var buff = new Buffer(img.replace(/^data:application\/(pdf);base64,/,''), 'base64');

//   fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
//   imageslist = filename;

// }


// var img= req.body.image;
// for(var i=0;i<img.length;i++){


// var extantion=img[i].img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

// imageslist=imageslist + filename+',';
// var buff = new Buffer(img[i].img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

// fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });

// }
// imageslist = imageslist.slice(0, -1);

  const newspaper = new Newspaper({agency});
      newspaper.image=imageslist;
  Newspaper.create(newspaper, function(err, newNewspaper) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    // User.update({_id: user.id}, { $push: {newspapers: newNewspaper}}, function(){});

    return res.json(newNewspaper);
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
  Newspaper.count().exec(function(err,totalCount){
    Newspaper.find().populate('agency').sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundNewspaper) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Newspaper Found Successfully',data:foundNewspaper,pages:totalPages});
      });
    });


   // Newspaper.count().exec(function(err,totalCount){

   //  Newspaper.find({},{},query,function(err, foundNewspapers) {
   //    console.log(foundNewspapers);
   //      if (err) {
   //        return res.status(422).send({errors: normalizeErrors(err.errors)});
   //      }

   //      if (city && foundNewspapers.length === 0) {
   //        return res.status(422).send({errors: [{title: 'No Newspapers Found!', detail: `There are no newspapers for city ${city}`}]});
   //      }
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Newspaper Found Successfully',data:foundNewspapers,pages:totalPages});
   //    });
   //  });
});




router.post('/getall', function(req, res) {
  const agency = req.body.agency;

  Newspaper.find({'agency':agency}).limit(1).sort({'createdAt':'desc'}).exec(function(err, foundNewspaper) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    return res.json({error:false,message:'Newspaper Found Successfully',data:foundNewspaper});
  });

});





module.exports = router;


