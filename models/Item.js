const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {type:mongoose.Types.ObjectId,ref: 'User',require:true},
  name: { type: String, required: true },
  material: { type: String, required: true },
  condition: { type: String, required: true }, 
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
