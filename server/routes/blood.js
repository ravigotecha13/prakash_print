const express = require('express');
const router = express.Router();
const Blood = require('../models/blood');
const Socialtalent = require('../models/socialtalent');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

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


  var bloodData = {};
      bloodData.status = 1;
  Blood
    .findById(req.params.id)
    .exec(function(err, foundBlood) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundBlood.set(bloodData);
      foundBlood.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundBlood);
      });
    });

});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Blood
    .where({user})
    .populate('bookings')
    .exec(function(err, foundBloods) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundBloods);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Blood
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundBlood) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundBlood.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not blood owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const bloodId = req.params.id;

  Blood.findById(bloodId)
        .exec(function(err, foundBlood) {

    if (err || !foundBlood) {
      return res.status(422).send({errors: [{title: 'Blood Error!', detail: 'Could not find Blood!'}]});
    }

    return res.json(foundBlood);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var bloodData = {};
      bloodData.city = req.body.city;
      bloodData.type = req.body.type;
      bloodData.name = req.body.name;
      bloodData.number = req.body.number;

  Blood
    .findById(req.params.id)
    .exec(function(err, foundBlood) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundBlood.set(bloodData);
      foundBlood.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundBlood);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {

  Blood
    .findById(req.params.id)
    .exec(function(err, foundBlood) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundBlood.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { city,type,name,number} = req.body;





 Blood
    .findOne({'number':number})
    .exec(function(err, foundBlood) {
      console.log(foundBlood);
      if(foundBlood){

        var bloodData = {};
        bloodData.city = city;
        bloodData.type = type;
        bloodData.name = name;
        bloodData.number = number;
        foundBlood.set(bloodData);
        foundBlood.save(function(err) {
          if (err) {
              return res.json({error:true,message:'Record Not Added'});
          }
        return res.json({error:false,message:'Blood Detail Added Successfully',data:foundBlood});
        });



      }else{


          const blood = new Blood({city,type,name,number});
          Blood.create(blood, function(err, newBlood) {

            if (err) {
              return res.json({error:true,message:'Record Not Added'});
            }
            return res.json({error:false,message:'Blood Detail Added Successfully',data:newBlood});
          });

      }




    });







  // const blood = new Blood({city,type,name,number});
  // Blood.create(blood, function(err, newBlood) {

  //   if (err) {
  //     return res.status(422).send({errors: normalizeErrors(err.errors)});
  //   }
  //   return res.json(newBlood);
  // });
});

router.post('/adddevice',  function(req, res) {
  const { city,type,name,number,status} = req.body;
  // check number

  Blood
    .findOne({'number':number})
    .exec(function(err, foundBlood) {
      console.log(foundBlood);
      if(foundBlood){

        var bloodData = {};
        bloodData.city = city;
        bloodData.type = type;
        bloodData.status = status;
        bloodData.name = name;
        bloodData.number = number;
        foundBlood.set(bloodData);
        foundBlood.save(function(err) {
          if (err) {
              return res.json({error:true,message:'Record Not Added'});
          }
        return res.json({error:false,message:'Blood Detail Added Successfully',data:foundBlood});
        });



      }else{


          const blood = new Blood({city,type,name,number,status});
          Blood.create(blood, function(err, newBlood) {

            if (err) {
              return res.json({error:true,message:'Record Not Added'});
            }
            return res.json({error:false,message:'Blood Detail Added Successfully',data:newBlood});
          });

      }




    });



});


router.post('/csvupload',  function(req, res) {
//  const { city1} = req.body; //,category,name,number
  var city =req.body.city1;
  var csvdata = req.body.csvdata.split('\r\n');
 for(var i =1; i<csvdata.length;i++){
  var splitcscdata = csvdata[i].split(',');
  var name= splitcscdata[1];
  var category = splitcscdata[0];
  var number = splitcscdata[2];
    if(splitcscdata[0] != ''){
     
     const blood = new Blood({city,category,name,number});

console.log(blood);
      Blood.create(blood, function(err, newBlood) {
        
        returndata =newBlood;
      });
    }


 }
  if(i == csvdata.length){
    return res.json({'name':''});
  }


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

router.get('', function(req, res) {
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
     searchquery={'$or': [{'type':{$regex: '(?i)'+decodeURI(req.query.search)}},{'name':{$regex: '(?i)'+decodeURI(req.query.search)}},{'number':{$regex: '(?i)'+decodeURI(req.query.search)}}]}; 
  }

Blood.find(searchquery)
//    .select('name')
    .populate('city')
    .populate('category')
    .limit(query.limit)
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundBloods) {
     return   Blood.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
     console.log(err);
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundBloods.map(function(foundBloods){
          return foundBloods.toJSONFor(foundBloods);
        }),

            })
        }) //.catch(next);
    })//.catch(next);




   // Blood.count().exec(function(err,totalCount){
   //  Blood.find().populate('city').limit(query.limit).skip(query.skip).then(function(foundBloods) {
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Newslive Found Successfully',data:foundBloods,pages:totalPages});
   //    });
   //  });
});

router.post('/getall', function(req, res) {
  const query = {};
  query.city = {"$in" : [req.body.city]};  //req.body.city;
  query.type = {"$in" : [req.body.type.toLowerCase()]};  //req.body.city;
  query.status = {"$nin" : 0};  //req.body.city;

  Blood.find(query).populate('city').exec(function(err, foundBlood) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json({error:false,message:'Blood Found Successfully',data:foundBlood});
  });

});

router.post('/getallgroup', function(req, res) {
  const query = {};
  query.city = {"$in" : [req.body.city]};  //req.body.city;

  Blood.find({'city' : req.body.city }).populate('city').exec(function(err,foundGroup) {

    if (err) {
    return res.json({error:true,message:'Blood Group Not Found '});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    var tmpcate = [];
    for(var i=0; i<foundGroup.length;i++){
      var abc=  {'type': foundGroup[i]['type']};
        if(tmpcate.indexOf(abc) === -1 ){
          tmpcate.push({'type': foundGroup[i]['type']});
        }
    }

  const result = [];
const map = new Map();
for (const item of tmpcate) {
    if(!map.has(item.type)){
        map.set(item.type, true);    // set any value to Map
        result.push({
            type: item.type,
        });
    }
}
    if(result == ''){
      return res.json({error:true,message:'Blood Group Not Found '});
    }else{
        return res.json({error:false,message:'Blood Group Found Successfully',data:result});

    }

  });

});



router.post('/getallgroupwithoutcity', function(req, res) {
  const query = {};

  Blood.find().populate('city').exec(function(err,foundGroup) {
console.log(foundGroup);
    if (err) {
    return res.json({error:true,message:'Blood Group Not Found '});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    var tmpcate = [];
    for(var i=0; i<foundGroup.length;i++){
      var abc=  {'type': foundGroup[i]['type'].toUpperCase()};
        if(tmpcate.indexOf(abc) === -1 ){
          tmpcate.push({'type': foundGroup[i]['type'].toUpperCase()});
        }
    }

  const result = [];
const map = new Map();
for (const item of tmpcate) {
    if(!map.has(item.type)){
        map.set(item.type, true);    // set any value to Map
        result.push({
            type: item.type,
        });
    }
}
    if(result == ''){
      return res.json({error:true,message:'Blood Group Not Found '});
    }else{
        return res.json({error:false,message:'Blood Group Found Successfully',data:result});

    }

  });

});


router.post('/getallcitywithtype', function(req, res) {
  const query = {};
  query.type = {"$in" : [req.body.type.toLowerCase()]};  //req.body.city;
console.log(query.type);
  Blood.find(query).populate('city').exec(function(err,foundGroup) {
//console.log(foundGroup);
    if (err) {
    return res.json({error:true,message:'Blood Group Not Found '});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    var tmpcate = [];
    for(var i=0; i<foundGroup.length;i++){
      console.log(foundGroup[i].city);

      // console.log(' i  '+i);
      if(foundGroup[i].city !=null && foundGroup[i].city !=""){
           var abc=  {'id': foundGroup[i]['city']['_id'],'city': foundGroup[i]['city']['name']};
          if(tmpcate.indexOf(abc) === -1 ){
            tmpcate.push({'id': foundGroup[i]['city']['_id'],'city': foundGroup[i]['city']['name']});
          }
      }
    }

  const result = [];
const map = new Map();
for (const item of tmpcate) {
    if(!map.has(item.id)){
        map.set(item.id, true);    // set any value to Map
        result.push({
            id: item.id,
            city: item.city.charAt(0).toUpperCase() + item.city.slice(1),
        });
    }
}
    if(result == ''){
      return res.json({error:true,message:'Blood Group Not Found '});
    }else{
        return res.json({error:false,message:'Blood Group Found Successfully',data:result});

    }

  });

});






module.exports = router;


