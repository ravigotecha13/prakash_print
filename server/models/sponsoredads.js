const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sponsoredadsSchema = new Schema({
  url: { type: String, required: true, lowercase: true },
  image: { type: String},
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Sponsoredads', sponsoredadsSchema );
