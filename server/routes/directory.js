const express = require('express');
const router = express.Router();
const Direcotry = require('../models/directory');
const Category = require('../models/category');
const Socialtalent = require('../models/socialtalent');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './assets/public/' });

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});
router.get('/socialtalent', function(req, res) {

    Socialtalent.findOne().exec(function(err, foundsocialtalent) {
        return res.json(foundsocialtalent);

    });

});
router.get('/:id/active', function(req, res) {
console.log(req.params.id);


  var directoryData = {};
      directoryData.status = 1;
  Direcotry
    .findById(req.params.id)
    .exec(function(err, foundDirecotry) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundDirecotry.set(directoryData);
      foundDirecotry.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundDirecotry);
      });
    });

});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Direcotry
    .where({user})
    .populate('bookings')
    .exec(function(err, foundDirecotrys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundDirecotrys);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Direcotry
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundDirecotry) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundDirecotry.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not directory owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const directoryId = req.params.id;

  Direcotry.findById(directoryId)
        .exec(function(err, foundDirecotry) {

    if (err || !foundDirecotry) {
      return res.status(422).send({errors: [{title: 'Direcotry Error!', detail: 'Could not find Direcotry!'}]});
    }

    return res.json(foundDirecotry);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var directoryData = {};
      directoryData.city = req.body.city;
      directoryData.category = req.body.category;
      directoryData.name = req.body.name;
      directoryData.number = req.body.number;
      directoryData.address = req.body.address;

  Direcotry
    .findById(req.params.id)
    .exec(function(err, foundDirecotry) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundDirecotry.set(directoryData);
      foundDirecotry.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundDirecotry);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

// Direcotry.remove({'city': req.params.id}, function(err){
//      if (err) {
//       return res.status(422).send({errors: normalizeErrors(err.errors)});
//     }
//      return res.json({'status': 'deleted'});
  
// });

  Direcotry
    .findById(req.params.id)
    .exec(function(err, foundDirecotry) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundDirecotry.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { city,category,name,number,address} = req.body;


  const directory = new Direcotry({city,category,name,number,address});
  Direcotry.create(directory, function(err, newDirecotry) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    return res.json(newDirecotry);
  });
});

router.post('/csvupload', multipartMiddleware, async  function(req, res) {
//  const { city1} = req.body; //,category,name,number

var XLSX = require('xlsx')

var workbook = XLSX.readFile(req.files.uploads[0].path);


var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//console.log(xlData);

  var city =req.body.city1;
  var j = 0;
  var k = 0;




 for(var i =0; i<xlData.length;i++){
  var splitcscdata = xlData[i];
  var category = splitcscdata.Category.toLowerCase();
    if(splitcscdata[0] != ''){
 var foundCategory = await Category.findOne({ 'name':splitcscdata.Category.toLowerCase() }).exec();

  if(foundCategory !=null){
        var splitcscdata = xlData[i];
        var name= splitcscdata.Name;
        var category = splitcscdata.Category.toLowerCase();
        var number = splitcscdata.Number;
        var address = splitcscdata.Address;

    const foundcatid = foundCategory._id;
    const directory = new Direcotry({city,name,number,address});
    directory.category = foundcatid;
    Direcotry.create(directory);

  }

 if(i == xlData.length - 1){
fs.unlink(req.files.uploads[0].path, function(err) {
    if(err && err.code == 'ENOENT') {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
    } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
    } else {

         return res.json({'name':''});
        console.info(`removed`);
    }
});


 }


//           k = k + 1;
//       });
//        j = j + 1;
    }

 }
//    return res.json({'name':''});
 console.log(k);
 

});

router.post('/updatesocialdata',  function(req, res) {
 
  var socialtalent = {};
//const socialtalent = new Socialtalent();
if(req.body.img != ''){
  var img= req.body.img,extantion=img.split(";")[0].split("/")[1],filename=UserCtrl.generateImageName()+'.'+extantion;

  var buff = new Buffer(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile('./dist/assets/public/'+filename, buff, function (err) { console.log('done'); });
socialtalent.image = filename;

}
console.log(socialtalent);

      

     
  Socialtalent
    .findOne()
    .exec(function(err, foundSocialtalent) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundSocialtalent.set(socialtalent);
      foundSocialtalent.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundSocialtalent);
      });
    });

 
});

router.get('', function(req, res,next) {
  // const city = req.query.city;
  // const query = city ? {city: city.toLowerCase()} : {};
  const query = {};
  var searchquery = {};
  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'createdAt':'desc'};
  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'name':{$regex: '(?i)'+req.query.search}},{'number':{$regex: '(?i)'+req.query.search}},{'address':{$regex: '(?i)'+req.query.search}}]}; //{$or: [{'name': new RegExp('^' + req.query.search+'$')}]}; //"$regex":"/^"+req.query.jobtitle+"/"};
  }

Direcotry.find(searchquery)
//    .select('name')
    .populate('city')
    .populate('category')
    .limit(query.limit)
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundDirecotrys) {
     return   Direcotry.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
     console.log(err);
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundDirecotrys.map(function(foundDirecotrys){
          return foundDirecotrys.toJSONFor(foundDirecotrys);
        }),

            })
        }) //.catch(next);
    })//.catch(next);





   // Direcotry.count().exec(function(err,totalCount){
   //  Direcotry.find(searchquery).populate('city category').sort(query.sort).limit(query.limit).skip(query.skip).then(function(foundDirecotrys) {
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Records Found Successfully',data:foundDirecotrys,pages:totalPages});
   //    });
   //  });
});


router.post('/getall', function(req, res) {
  const query = {};
  query.category = {"$in" : [req.body.category]}; // req.body.category;
  query.city = {"$in" : [req.body.city]};  //req.body.city;
console.log(query);
  Direcotry.find({'category': req.body.category,'city' : req.body.city, 'status' : {"$nin": false}  }).populate('city category').sort({name: 1 }).exec(function(err,foundDirecotry) {
//console.log(foundDirecotry);
    if (err) {
    return res.json({error:true,message:'Direcotry Not Found '});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    var tmpdirectory = [];
    for(var i=0; i<foundDirecotry.length;i++){

        var tmplist = {}; 
          tmplist['_id'] = foundDirecotry[i]['_id'];
          tmplist['name'] = foundDirecotry[i]['name'].charAt(0).toUpperCase() + foundDirecotry[i]['name'].substr(1);
          tmplist['number'] = foundDirecotry[i]['number'];
          tmplist['address'] = foundDirecotry[i]['address'].charAt(0).toUpperCase() + foundDirecotry[i]['name'].substr(1);
          tmplist['createdAt'] = foundDirecotry[i]['createdAt'];
          tmpdirectory.push(tmplist);
    }
console.log(tmpdirectory);

    return res.json({error:false,message:'Direcotry Found Successfully',data:foundDirecotry});
  });

});
router.post('/add_directory',  function(req, res) {
  const { city,category,name,number,address,status} = req.body;


  const directory = new Direcotry({city,category,name,number,address,status});
  Direcotry.create(directory, function(err, newDirecotry) {

    if (err) {
    return res.json({error:true,message:'Direcotry Not Added '});
    }
    return res.json({error:false,message:'Direcotry Found Successfully',data:newDirecotry});
  });
});


module.exports = router;


