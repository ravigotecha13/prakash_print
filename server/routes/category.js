const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Directory = require('../models/directory');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');

const UserCtrl = require('../controllers/user');
var fs = require("fs");

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({"secret": true});
});

router.get('/manage',  UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Category
    .where({user})
    .populate('bookings')
    .exec(function(err, foundCategorys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundCategorys);
  });
});

router.get('/list',  UserCtrl.authMiddleware, function(req, res) {
  Category.find().sort({'name':'asc'}).exec(function(err, foundCategorys) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    return res.json(foundCategorys);
  });
});

router.get('/:id/verify-user', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Category
    .findById(req.params.id)
    .populate('user')
    .exec(function(err, foundCategory) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (foundCategory.user.id !== user.id) {
        return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'You are not category owner!'}]});
      }


      return res.json({status: 'verified'});
    });
});

router.get('/:id', function(req, res) {
  const categoryId = req.params.id;

  Category.findById(categoryId)
        .exec(function(err, foundCategory) {

    if (err || !foundCategory) {
      return res.status(422).send({errors: [{title: 'Category Error!', detail: 'Could not find Category!'}]});
    }

    return res.json(foundCategory);
  });
});

router.patch('/:id', UserCtrl.authMiddleware, function(req, res) {

  var categoryData = {};
categoryData.name = req.body.name;

  Category
    .findById(req.params.id)
    .exec(function(err, foundCategory) {

      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      foundCategory.set(categoryData);
      foundCategory.save(function(err) {
        if (err) {
          return res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        return res.status(200).send(foundCategory);
      });
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Category
    .findById(req.params.id)
    .exec(function(err, foundCategory) {

    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    foundCategory.remove(function(err) {
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

//   var split = name.split(',');
//   for($i=0; $i<split.length;$i++){
//   console.log(split[$i]);

//   const category = new Category();
//   category.name = split[$i];
//   Category.create(category, function(err, newCategory) {
// //    return res.json(newCategory);
//   });
//   }
//       return res.json({'status': 'deleted'});

  const category = new Category({name});
  Category.create(category, function(err, newCategory) {
console.log(err);
    if (err) {
     return res.status(422).send({errors: normalizeErrors(err)});
    }

   return res.json(newCategory);
 });
});

router.get('', function(req, res) {
  const category = req.query.category;
  const query = category ? {category: category.toLowerCase()} : {};

  var pageNo =req.query.pageno ?  parseInt(req.query.pageno) : 1;
  var size = req.query.size ? parseInt(req.query.size) : 10;
  var searchquery = {};
  query.skip = size * (pageNo - 1)
  query.limit = size;  
  query.sort = {'name':'asc'};
  if(req.query.search !=null && req.query.search !=''){
     searchquery={'$or': [{'name':{$regex: '(?i)'+req.query.search}}]}; 
  }

    Category.find(searchquery)
//    .select('name')
    .limit(query.limit)
    .skip(query.skip)
    .sort(query.sort)
    .exec(function(err, foundCategorys) {
     return   Category.count(searchquery).exec(function(err, count) {
     var totalPages = Math.ceil(count / size)
      return  res.json({
          error: false,
          pages: totalPages,
          data: foundCategorys.map(function(foundCategorys){
          return foundCategorys.toJSONFor(foundCategorys);
        }),

            })
        }) //.catch(next);
    })//.catch(next);



   // Category.count().exec(function(err,totalCount){

   //  Category.find({},{},query,function(err, foundCategorys) {
   //      if (err) {
   //        return res.status(422).send({errors: normalizeErrors(err.errors)});
   //      }

   //      if (category && foundCategorys.length === 0) {
   //        return res.status(422).send({errors: [{title: 'No Categorys Found!', detail: `There are no categorys for category ${category}`}]});
   //      }
   //       var totalPages = Math.ceil(totalCount / size)
   //      return res.json({error:false,message:'Category Found Successfully',data:foundCategorys,pages:totalPages});
   //    });
   //  });
});

router.post('/getall', function(req, res) {

  var query = {};

//     query.city={"$in" : [req.body.city]};
// //  query.city=req.body.city;
// console.log(query);
// var stream = Directory.aggregate([
//   // {"$sort": {"companyname": 1}},
        

//   { "$facet": {
//     "totalData": [
//      { "$match":  {'city' : [req.body.city]}},
//         //   { "$group": {
//         //     "_id": "$category",
//         //     "count": { "$sum": 1 },
//         //     "data": { $push : "$$ROOT" }
//         //     }
//         // },
//         // { "$skip": perPage * page },
//         // { "$limit": perPage },

//       ],
//   },

// }
// ]).allowDiskUse(true).cursor({ batchSize: 1000 }).exec()
// console.log('--------------------------');
// stream.on('data', function(doc) {
// console.log(doc.totalData);
//       return res.json({
//         error: false,
//         // total: doc.totalCount.length, // doc.totalCount.count,
//         // per_page: perPage,
//         // current_page: current_page,
//         // last_page: totalpages,
//         data: doc,
//        });



// }).on('error', function(err) {
//   console.log(err);
// }).on('end',function(){

//   console.log('-------- END-----------');
// });


// return false;


// Directory.aggregate([{
//                             $unwind: '$category'
//                         }, {
//                             $group: {
//                                 _id: '$category',
//                                 category: {
//                                     $sum: '$category'
//                                 }
//                             }
//                         }])
//     .exec(function(err, transactions) {
//         // Don't forget your error handling
//         // The callback with your transactions
//         // Assuming you are having a Tag model
//         console.log(transactions);
//         // Tag.populate(transactions, {path: '_id'}, function(err, populatedTransactions) {
//         //     // Your populated translactions are inside populatedTransactions
//         // });
//     });

// Directory.aggregate([
//       { $match: {city : req.body.city}},
//       { $lookup: {from: 'category', localField: 'category', foreignField: '_id', as: 'category'} }
//     ]).exec( function (err, invites) {
//       if (err) {
//         console.log(err);
// //        next(err);
//       }
// console.log(invites);
// //      res.json(invites);
//     }
//   );



  Directory.find({'city' : req.body.city}).populate({path: 'category', options: { sort: { name: 1 } } }).select({'_id' : 0,'category': 1}).exec(function(err,foundDirectory) {
    if (err) {
    return res.json({error:true,message:'Category Not Found '});
//      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
console.log(foundDirectory.length);
    var tmpcate = [];
    for(var i=0; i<foundDirectory.length;i++){
    	if(foundDirectory[i]['category'] !=null){
	        var index = tmpcate.findIndex(x => x._id==foundDirectory[i]['category']['_id']);
	        if(index === -1 ){
	          tmpcate.push({'_id': foundDirectory[i]['category']['_id'],'name': foundDirectory[i]['category']['name']});
	        }
    	}
        
    }
// //    console.log(tmpcate);
    if(tmpcate == ''){
      return res.json({error:true,message:'Category Not Found '});
    }else{
        return res.json({error:false,message:'Category Found Successfully',
          data:tmpcate

       });

   }
  });



  // Category.find().exec(function(err, foundCategory) {

  //   if (err) {
  //     return res.status(422).send({errors: normalizeErrors(err.errors)});
  //   }

  //   return res.json({error:false,message:'Category Found Successfully',data:foundCategory});
  // });

});

router.post('/getallcategory',   function(req, res) {
  Category.find().sort({'name':'asc'}).exec(function(err, foundCategorys) {

    if (err) {
      return res.json({error:true,message:'Category Not Found '});
    }

    return res.json({error:false,message:'Category Found Successfully',data:foundCategorys});
  });
});


module.exports = router;


