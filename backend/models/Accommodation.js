const mongoose = require('mongoose');

const priceOptionSchema = new mongoose.Schema({
  nights: { type: Number, required: true },
  persons: { type: Number, required: true },
  price: { type: Number, required: true }
});

const accommodationSchema = new mongoose.Schema({
  type: { type: String, enum: ['hostel', 'hotel'], required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  priceOptions: [priceOptionSchema],
  bookingLimit: { type: Number, default: 6 },
  availableRooms: { type: Number, required: true },
  notes: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;