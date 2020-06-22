const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoadSchema = new Schema({
  name: { type: String, required: true },
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  url: { type: String, required: true},
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


videoadSchema.methods.toJSONFor = function(){
  return {
    _id: this._id,
    name: this.name,
    city:this.city,
    url:this.url,
    status: this.status,
	};
};



module.exports = mongoose.model('Videoad', videoadSchema );
