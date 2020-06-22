const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  division :{ type: Schema.Types.ObjectId, ref: 'Division'  },
  type :{ type: String, required: true, lowercase: true },
  previewimage: { type: String,  lowercase: true },
  url: { type: String,  lowercase: true },
  file: { type: String },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Material', materialSchema );
