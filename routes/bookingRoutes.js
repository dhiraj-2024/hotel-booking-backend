const express = require("express");
const { 
  createBooking, 
  checkStatus, 
  getBookingDetails,
  updateRoomAvailability, 
  excelExport
} = require("../controllers/bookingController.js"); 

const router = express.Router();

// router.post("/bookings", createBooking);
router.post("/", createBooking);
router.get("/status/:order_id", checkStatus);
router.get("/booking/:order_id", getBookingDetails);
router.put("/accommodations/:id/update-rooms", updateRoomAvailability);
router.get('/export-bookings',excelExport)

module.exports = router;

