const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bloodSchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  type: { type: String, required: true, lowercase: true },
  name: { type: String, required: true, lowercase: true },
  number: { type: String, required: true, lowercase: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});

bloodSchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    city:this.city,
    type:this.type,
    name: this.name,
    number: this.number,
    status: this.status,
	};
};

module.exports = mongoose.model('Blood', bloodSchema );
