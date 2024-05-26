const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: String,
    telephone: String,
    price: Number,
    description: String,
    category: String,
    images: [String],
    createdAt: Date
});

module.exports = mongoose.model('Ad', adSchema);
