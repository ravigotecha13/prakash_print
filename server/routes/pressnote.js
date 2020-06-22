const express = require('express');
const router = express.Router();
const Pressnote = require('../models/pressnote');
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

  Pressnote
    .where({user})
    .populate('bookings')
    .exec(function(err, foundPressnotes) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundPressnotes);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Pressnote
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundPressnote) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundPressnote.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not pressnote owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const pressnoteId = req.params.id;

  Pressnote.findById(pressnoteId)
        .exec(function(err, foundPressnote) {

    if (err || !foundPressnote) {
      return res.status(422).send({errors: [{title: 'Pressnote Error!', detail: 'Could not find Pressnote!'}]});
    }

    return res.json(foundPressnote);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var pressnoteData = {};
console.log(pressnoteData);
if(req.body.image != ''){
  var img= req.body.image,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
pressnoteData.image = filename;

}

  Pressnote
    .findById(req.params.id)
    .exec(function(err, foundPressnote) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundPressnote.set(pressnoteData);
      foundPressnote.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundPressnote);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Pressnote
    .findById(req.params.id)
    .exec(function(err, foundPressnote) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundPressnote.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add', function(req, res) {




// // New custom Code Multiple Image Start 
// if(req.body.id ==""){

//     var filename = '';
//     var objlist = [];
//     console.log(req.files);
//     if(req.files !="" && req.files !=null && Object.keys(req.files).length != 0 ){
//       var img= req.files.image;
//       objlist.push({'type':req.body.type,'title':req.body.title,'name':req.body.name,'number':req.body.number,'desc':req.body.desc,image :img.path.split('/')[2]}); 

//     }else{
//       objlist.push({'type':req.body.type,'title':req.body.title,'name':req.body.name,'number':req.body.number,'desc':req.body.desc,image :''}); 

//     }
// console.log(objlist);
// return      Pressnote.create(objlist, function(err, newPressnote) {

//          return res.json({error:false,message:'Pressnote added Successfully',data:newPressnote[0]._id});
//       });

// }else{



// return  Pressnote
//     .findById(req.body.id)
//     .exec(function(err, foundpressnote) {
// console.log(err);
//       var filename = '';
//       var objlist = [];
//       var currentimg= foundpressnote.image.split(',');
  

//       if(req.files !=null && req.files != "" && Object.keys(req.files).length != 0){
//         var img= req.files.image;
//         currentimg.push(img.path.split('/')[2]);
//         var addedimage = currentimg.join(',');
//         objlist.image =  addedimage; 
//       }

// console.log(objlist);
//       foundpressnote.set(objlist);
// return      foundpressnote.save(function(err) {

//          return res.json({error:false,message:'Pressnote updated Successfully',data:foundpressnote._id});
//       });
//     });




// }






















// New custom Code Multiple Image END 




















var filename = '',filename1='',filename2='';
if(req.body.image1 !="0"){

var img= req.body.image1,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;
var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
//console.log(img);

fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done1'); });
}
if(req.body.image2 !="0"){

var img= req.body.image2,extantion=img.split(";")[0].split("/")[1],filename1=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename1, buff, function (err) { console.log('done2'); });
}
if(req.body.image3 !="0"){

var img= req.body.image3,extantion=img.split(";")[0].split("/")[1],filename2=UserCtrl.generateImageName()+'.'+extantion;

var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

fs.writeFile('./dist/assets/public/'+filename2, buff, function (err) { console.log('done3'); });
}

  const pressnote = new Pressnote();
      pressnote.image=filename;
      pressnote.image2=filename1;
      pressnote.image3=filename2;
      pressnote.type=req.body.type;
      pressnote.title=req.body.title;
      pressnote.name=req.body.name;
      pressnote.number=req.body.number;
      pressnote.desc=req.body.desc;
//      pressnote.size=req.body.size;
      console.log(pressnote);
  Pressnote.create(pressnote, function(err, newPressnote) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

     return res.json({error:false,message:'Pressnote added Successfully',data:newPressnote});
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
//  query.type = {'$nin':['history']};
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};
console.log(query);
   Pressnote.count({'type':{'$nin':['history','video']}}).exec(function(err,totalCount){

    Pressnote.find({'type':{'$nin':['history','video']}}).sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundPressnotes) {
//    Pressnote.find({},,query,function(err, foundPressnotes) {

        if (city && foundPressnotes.length === 0) {
          return res.status(422).send({errors: [{title: 'No Pressnotes Found!', detail: `There are no pressnotes for city ${city}`}]});
        }
         var totalPages = Math.ceil(totalCount / size)
        return res.json({error:false,message:'Pressnote Found Successfully',data:foundPressnotes,pages:totalPages});
      });
    });
});


module.exports = router;


