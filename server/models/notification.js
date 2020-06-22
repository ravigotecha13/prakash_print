const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: { type: String,  lowercase: true },
  description: { type: String, lowercase: true },
  image: { type: String},
  status: Boolean,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Notification', notificationSchema );
