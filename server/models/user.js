const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : {type: String},
  mobileno : {type: String},
  patname : {type: String},
  email: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
  //   unique: true,
  //   lowercase: true,
  //   required: 'Email is required',
  //   match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
   password: {
    type: String,
    min: [4, 'Too short, min is 4 characters'],
    max: [32, 'Too long, max is 32 characters'],
//    required: 'Password is required'
  },
  city: {type: String},// { type: Schema.Types.ObjectId, ref: 'City' },
  fcmtoken: {type: String},// { type: Schema.Types.ObjectId, ref: 'City' },
  deviceType: {type: String},// { type: Schema.Types.ObjectId, ref: 'City' },
  createdAt: { type: Date, default: Date.now },
});


//module.exports = mongoose.model('Blood', bloodSchema );


// const userSchema = new Schema({
//   // username: {
//   //   type: String,
//   //   min: [4, 'Too short, min is 4 characters'],
//   //   max: [32, 'Too long, max is 32 characters']
//   // },
//   name : {type: String},
//   mobileno : {type: String},
//   email: {
//     type: String,
//     min: [4, 'Too short, min is 4 characters'],
//     max: [32, 'Too long, max is 32 characters'],
//     unique: true,
//     lowercase: true,
//     required: 'Email is required',
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
//   },
//   city: { type: Schema.Types.ObjectId, ref: 'City' },
// //  city: [{type: Schema.Types.ObjectId, ref: 'City'}],
//   // password: {
//   //   type: String,
//   //   min: [4, 'Too short, min is 4 characters'],
//   //   max: [32, 'Too long, max is 32 characters'],
//   //   required: 'Password is required'
//   // },
//  // stripeCustomerId: String,
// //  revenue: Number,
// //  rentals: [{type: Schema.Types.ObjectId, ref: 'Rental'}],
// //  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
// });

userSchema.methods.hasSamePassword = function(requestedPassword) {

 return bcrypt.compareSync(requestedPassword, this.password);
}


userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });
});

userSchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    name:this.name,
    mobileno:this.mobileno,
    patname: this.patname,
    city: this.city,
    fcmtoken: this.fcmtoken,
    deviceType: this.deviceType,
    createdAt : this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema );
