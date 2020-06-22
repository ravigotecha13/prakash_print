const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmerconerSchema = new Schema({
  type :{ type: String, required: true, lowercase: true },
  previewimage: { type: String,  lowercase: true },
  url: { type: String,  lowercase: true },
  file: { type: String },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Farmerconer', farmerconerSchema );
