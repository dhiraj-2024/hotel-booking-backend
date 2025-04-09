require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes.js");
const nominativeRoutes = require("./routes/nominativeRoutes.js");
const internationalAthleteRoutes = require("./routes/internationalAthleteRoutes.js");
const accommodationRoutes = require('./routes/accommodationRoutes.js');

//! DATABASE CONNECTION                  
connectDB();

const app = express();

//! MIDDLEWARES 
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add OPTIONS method
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.options('*', cors()); 
app.use(express.json());

//! ROUTES
//? MAG_WAG BOOKING
app.use("/api/bookings", bookingRoutes);
//? NOMINATIVE BOOKING
app.use("/api/nominative", nominativeRoutes);
//? INTERNATIONAL ATHLETE BOOKING
app.use("/api/international-athletes", internationalAthleteRoutes);
//? ACCOMMODATION hotel data
app.use('/api/accommodations', accommodationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!' });
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});