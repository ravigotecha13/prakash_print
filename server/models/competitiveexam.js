const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const competitiveexamSchema = new Schema({
  type :{ type: String, required: true, lowercase: true },
  
  url: { type: String,  lowercase: true },
  file: { type: String },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('CompetitiveExam', competitiveexamSchema );
