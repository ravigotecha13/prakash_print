const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencySchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  image: { type: String},
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Agency', agencySchema );
