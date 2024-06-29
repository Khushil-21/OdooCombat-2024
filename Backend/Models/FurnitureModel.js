const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['chair', 'sofa', 'table', 'bed', 'dinning table']
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    bookedDates: [{
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        }
    }]
}, { versionKey: false });

const Furniture = mongoose.models.Furniture || mongoose.model('Furniture', furnitureSchema);

module.exports = Furniture;
