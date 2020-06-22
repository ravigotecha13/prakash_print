const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});

categorySchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    name:this.name,
    status:this.status,
  };
};


module.exports = mongoose.model('Category', categorySchema );
