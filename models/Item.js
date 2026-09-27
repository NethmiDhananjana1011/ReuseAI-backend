const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  material: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String },
  recommendations: { type: [String], default: [] } // AI අදහස් සේව් කරන්න අලුතින් එකතු කළ කොටස
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);