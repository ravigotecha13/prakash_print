const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newspaperSchema = new Schema({
  agency: { type: Schema.Types.ObjectId, ref: 'Agency' },
  image: { type: String, required: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Newspaper', newspaperSchema );
