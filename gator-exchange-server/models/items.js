const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    images: [{
        url: String,        // base64 data URI
        filename: String,   // original filename
        mimetype: String,   // file mimetype
        size: Number        // file size in bytes
    }],
    availableDates: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const itemModel = mongoose.model("items", itemSchema)
module.exports = itemModel