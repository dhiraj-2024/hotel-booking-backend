// const mongoose = require("mongoose");

// const HotelSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   type: { type: String, enum: ["hotel", "hostel"], required: true },
//   roomTypes: [{
//     capacity: { type: Number, required: true }, // 2, 3, or 4 persons
//     price_4_nights: { type: Number, required: true },
//     price_5_nights: { type: Number, required: true },
//     totalRooms: { type: Number, required: true },
//     availableRooms: { type: Number, required: true },
//     notes: { type: String }
//   }],
//   notes: { type: String }
// }, { timestamps: true });

// module.exports = mongoose.model("Hotel", HotelSchema);