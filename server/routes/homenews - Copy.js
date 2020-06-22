const express = require('express');
const router = express.Router();
const Homenews = require('../models/homenews');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',   function(req, res) {
  const user = res.locals.user;

  Homenews
    .where({user})
    .populate('bookings')
    .exec(function(err, foundHomenews) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundHomenews);
  });
});

router.get('/allnews1', function(req, res) {
console.log('12122121');
    Homenews.find().sort({createdAt: 'desc'}).then(function(foundHomenewss) {
      console.log('121221');
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss});
    });
});



router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Homenews
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundHomenews) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundHomenews.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not homenews owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const homenewsId = req.params.id;

  Homenews.findById(homenewsId)
        .exec(function(err, foundHomenews) {

    if (err || !foundHomenews) {
      return res.status(422).send({errors: [{title: 'Homenews Error!', detail: 'Could not find Homenews!'}]});
    }

    return res.json(foundHomenews);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var homenewsData = {};
homenewsData.agency = req.body.agency;
console.log(homenewsData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
homenewsData.image = filename;

}

  Homenews
    .findById(req.params.id)
    .exec(function(err, foundHomenews) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundHomenews.set(homenewsData);
      foundHomenews.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundHomenews);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Homenews
    .findById(req.params.id)
    .exec(function(err, foundHomenews) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundHomenews.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { agency} = req.body;



var imageslist='';
var img= req.body.image;
for(var i=0;i<img.length;i++){


var extantion=img[i].img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

imageslist=filename;
var buff = new Buffer(img[i].img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });


const homenews = new Homenews({agency});
      homenews.image=imageslist;
  Homenews.create(homenews);



}

  return res.json({error:false,message:'Record Added Successfully'});
//    return res.json(newHomenews);
//imageslist = imageslist.slice(0, -1);

  
});

router.get('', function(req, res) {
console.log('1211221');
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};

   Homenews.count().exec(function(err,totalCount){
    Homenews.find().populate('city').limit(query.limit).skip(query.skip) .sort({createdAt: 'desc'}).then(function(foundHomenewss) {
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss,pages:totalPages});
      });
    });
});


router.post('/allnews',   function(req, res) {

/*{
    "createdAt": 
    {
        $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))
    }

    }*/
    Homenews.find().sort({createdAt: -1}).then(function(foundHomenewss) {
        return res.json({error:false,message:'Home News Found Successfully',data:foundHomenewss});
    });
});

router.post('/update',   function(req, res) {

  const id = req.body.id;
  var homeData = {};
  homeData.createdAt = req.body.date;


  Homenews
    .findById(id)
    .exec(function(err, foundhome) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundhome.set(homeData);
      foundhome.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundhome);
      });
    });

});


module.exports = router;


