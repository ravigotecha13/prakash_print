const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const direcotrySchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: 'City',index: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' ,index: true},
 // category:{ type: String, required: true, lowercase: true },
  name: { type: String, required: true, lowercase: true },
  number: { type: String,  lowercase: true },
  address: { type: String, lowercase: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});

direcotrySchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    city:this.city,
    category:this.category,
    name: this.name,
    number: this.number,
    address: this.address,
    status: this.status,
	};
};
module.exports = mongoose.model('Direcotry', direcotrySchema );
