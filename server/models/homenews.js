const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homenewsSchema = new Schema({
//  city: { type: Schema.Types.ObjectId, ref: 'City' },
  agency : { type: String, required: true },
  image: { type: String, required: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Homenews', homenewsSchema );
