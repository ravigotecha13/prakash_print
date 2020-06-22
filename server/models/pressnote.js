const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pressnoteSchema = new Schema({
  type : {type: String},
  title : {type: String},
  name : {type: String},
  number : {type: String},
  desc : {type: String},
  size : {type: String},
  image: { type: String },
  image2: { type: String },
  image3: { type: String },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});
pressnoteSchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    type:this.type,
    title:this.title,
    name: this.name,
    number: this.number,
    desc: this.desc,
    size: this.size,
    image: this.image,
    image2: this.image2,
    image3: this.image3,
    status: this.status,
  };
};


module.exports = mongoose.model('Pressnote', pressnoteSchema );
