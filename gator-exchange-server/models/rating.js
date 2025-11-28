const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  reviewee: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'items', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rating', RatingSchema);