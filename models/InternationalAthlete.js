const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] }
});

const InternationalAthleteSchema = new mongoose.Schema({
  // Contact Information
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  
  // Team Information
  teamType: { type: String, required: true, enum: ["MAG", "WAG"] },
  // country: { type: String, default: "International" },
  state: { type: String, required: true },
  
  // Booking Dates
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  stayDuration: { type: Number, required: true, enum: [4, 5] },
  
  // Room Information
  // doubleRooms: { type: Number, required: true, min: 0 },
  // tripleRooms: { type: Number, required: true, min: 0 },
  // totalMembers: { type: Number, required: true },
  // totalRooms: { type: Number, required: true },
  
  // Member Details
  // memberDetails: { 
  //   type: [memberSchema], 
  //   required: true,
  //   validate: {
  //     validator: function(v) {
  //       return v.length === this.totalMembers;
  //     },
  //     message: props => `Member details count must match total members`
  //   }
  // },
  
  // Hotel Information
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation", required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation", required: true },
  hotelName: { type: String, required: true },
  
  // Booking Metadata
  accommodationType: { type: String, default: "hotel" },
  bookingType: { type: String, default: "international" },
  
  // Payment Information
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ["PENDING", "PAID", "FAILED"], 
    default: "PENDING" 
  },
  orderId: { type: String, required: true, unique: true },
  paymentLink: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("InternationalAthlete", InternationalAthleteSchema);