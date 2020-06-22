const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiseSchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: { type: String},
  isCategory: { type: String},
  type: { type: String, required: true },
  url: { type: String},
  sliderimage: { type: String },
  pagetype: { type: String },
  leftimage: { type: String },
  bottomimage: { type: String },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


advertiseSchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    city:this.city,
    category:this.category,
    isCategory:this.isCategory,
    name: this.name,
    type : this.type,
    url: this.url,
    sliderimage : this.sliderimage,
    pagetype : this.pagetype,
    leftimage : this.leftimage,
    bottomimage : this.bottomimage,
    status: this.status,
	};
};

module.exports = mongoose.model('Advertise', advertiseSchema );
