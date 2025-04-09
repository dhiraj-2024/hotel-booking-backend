// backend/models/Nominative.js
const mongoose = require("mongoose");

const NominativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ["gymnast", "hod", "judge", "technical_official", "coach", "manager"] },
  state: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true }, 
//   email: { type: String, required: true },
//   teamName: { type: String, required: true },
  registrationFee: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED", "FREE"], default: "PENDING" },
  orderId: { type: String, required: true, unique: true },
  paymentLink: { type: String },
  orderType: { type: String, default: "nominative_entry" }
}, { timestamps: true });

module.exports = mongoose.model("Nominative", NominativeSchema);