const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  subname: { type: String, lowercase: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Division', divisionSchema );
