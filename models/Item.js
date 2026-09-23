const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    condition: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
}, { timestamps: true }

);

module.exports = mongoose.model('Item',itemSchema);