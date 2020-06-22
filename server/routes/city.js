const express = require('express');
const router = express.Router();
const City = require('../models/city');
const Direcotry = require('../models/directory');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  City
    .where({user})
    .populate('bookings')
    .exec(function(err, foundCitys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundCitys);
  });
});

router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  City.find().sort({'name':'asc'}).exec(function(err, foundCitys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundCitys);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  City
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundCity) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundCity.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not city owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const cityId = req.params.id;

  City.findById(cityId)
        .exec(function(err, foundCity) {

    if (err || !foundCity) {
      return res.status(422).send({errors: [{title: 'City Error!', detail: 'Could not find City!'}]});
    }

    return res.json(foundCity);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var cityData = {};
cityData.name = req.body.name;

  City
    .findById(req.params.id)
    .exec(function(err, foundCity) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundCity.set(cityData);
      foundCity.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundCity);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  City
    .findById(req.params.id)
    .exec(function(err, foundCity) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundCity.remove(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'status': 'deleted'});
    });
  });
});
//UserCtrl.authMiddleware,
router.post('/add',  function(req, res) {
  const { name} = req.body;


  const city = new City({name});
  City.create(city, function(err, newCity) {
console.log(err);
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(newCity);
  });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? {city: city.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  var searchquery = {};
  query.skip = size * (pageNo - 1)
  query.limit = size;
  query.sort = {'name':'asc'};
  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'name':{$regex: '(?i)'+req.query.search}}]}; 
  }

    City.find(searchquery)
//    .select('name')
    .limit(query.limit)
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundCity) {
     return   City.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundCity.map(function(foundCity){
          return foundCity.toJSONFor(foundCity);
        }),

            })
        }) //.catch(next);
    })//.catch(next);


});


router.post('/getall', function(req, res) {

  var type = req.body.type;

  if(type !=null && type !=''){
        Direcotry.find({'status' : {"$nin": false}  }).populate('city').exec(function(err,foundGroup) {
           if (err) {
            return res.json({error:true,message:'Blood Group Not Found '});
        //      return res.status(422).send({errors: normalizeErrors(err.errors)});
            }
            var tmpcate = [];
            for(var i=0; i<foundGroup.length;i++){
              var abc=  {'id': foundGroup[i]['city']['_id'],'city': foundGroup[i]['city']['name']};
                if(tmpcate.indexOf(abc) === -1 ){
                  tmpcate.push({'id': foundGroup[i]['city']['_id'],'city': foundGroup[i]['city']['name']});
                }
            }

          const result = [];
        const map = new Map();
        for (const item of tmpcate) {
            if(!map.has(item.id)){
                map.set(item.id, true);    // set any value to Map
                result.push({
                    _id: item.id,
                    name: item.city.charAt(0).toUpperCase() + item.city.slice(1),
                });
            }
        }
            if(result == ''){
              return res.json({error:true,message:'City Not Found '});
            }else{
                return res.json({error:false,message:'City Found Successfully',data:result});

            }

          });



  }else{




      City.find().sort({'name': 1}).exec(function(err, foundCitys) {

        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.json({error:false,message:'City Found Successfully',data:foundCitys});
      });
    }
});






module.exports = router;


