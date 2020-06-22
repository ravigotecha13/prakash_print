const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});

citySchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    name:this.name,
    status:this.status,
  };
};

module.exports = mongoose.model('City', citySchema );
