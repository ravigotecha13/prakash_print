const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newslinkSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  url: { type: String, required: false, lowercase: true },
  file: { type: String, required: false },
  image: { type: String, required: false },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Newslink', newslinkSchema );
