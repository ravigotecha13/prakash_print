const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsliveSchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: 'City' },
  url: { type: String, required: true, lowercase: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Newslive', newsliveSchema );
