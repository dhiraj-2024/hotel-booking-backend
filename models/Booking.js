const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // teamName: { type: String, required: true },
  teamType: { type: String, required: true },
  state: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  stayDuration: { type: String, required: true },
  // memberDetails: [{ 
  //   name: { type: String, required: true },
  //   gender: { type: String, required: true }
  // }],
  totalPrice: { type: Number, required: true },
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  accommodationType: { type: String, required: true },
  roomDetails: {
    roomType1: { type: Number, required: true },
    roomType2: { type: Number, required: true }
  },
  totalMembers: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  paymentStatus: { type: String, default: "PENDING" },
  orderId: { type: String, required: true, unique: true },
  paymentLink: { type: String },
  orderType: { type: String, default: "hotel_booking" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);