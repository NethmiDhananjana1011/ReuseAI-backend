const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  condition: { type: String, required: true }, // මෙතන Number වෙනුවට String වෙන්න ඕන
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
