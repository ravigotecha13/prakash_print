const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newschannelSchema = new Schema({
//  agency: { type: String, required: true, lowercase: true },
  url: { type: String, required: true },
  image: { type: String, required: true },
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Newschannel', newschannelSchema );
