const Accommodation = require("../models/Accommodation");
const InternationalAthlete = require("../models/InternationalAthlete");
const axios = require("axios");
const ExcelJS = require('exceljs');


const createInternationalAthlete = async (req, res) => {
  try {
    // console.log("Incoming request body:", req.body);

    const { 
      name,
      mobileNumber,
      email,
      teamType,
      state,
      checkIn,
      checkOut,
      stayDuration,
      // doubleRooms,
      // tripleRooms,
      // memberDetails,
      totalPrice,
      hotelId,
      hotelName
    } = req.body;

    // Validate required fields
    const requiredFields = [
      { field: 'name', name: 'Contact Person Name' },
      { field: 'mobileNumber', name: 'Mobile Number' },
      { field: 'email', name: 'Email Address' },
      { field: 'state', name: 'State' },
      { field: 'teamType', name: 'Team Type' },
      { field: 'checkIn', name: 'Check-in Date' },
      { field: 'checkOut', name: 'Check-out Date' },
      { field: 'stayDuration', name: 'Stay Duration' },
      { field: 'hotelId', name: 'Hotel ID' }
    ];
    
    const missingFields = requiredFields
      .filter(({ field }) => !req.body[field])
      .map(({ name }) => name);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // // Type validation
    // if (isNaN(doubleRooms) || isNaN(tripleRooms) || isNaN(totalPrice)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid number format for rooms or price"
    //   });
    // }

    // Check room availability
    const hotel = await Accommodation.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hotel not found" 
      });
    }

    // const totalRooms = parseInt(doubleRooms) + parseInt(tripleRooms);
    // if (hotel.availableRooms < totalRooms) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: `Not enough rooms available (${hotel.availableRooms} remaining, requested ${totalRooms})`,
    //     availableRooms: hotel.availableRooms
    //   });
    // }

    // Calculate total members
    // const totalMembers = (doubleRooms * 2) + (tripleRooms * 3);
    const orderId = `INT-ATH-${Date.now()}`;

    // Create new booking
    const newAthlete = new InternationalAthlete({
      name,
      mobileNumber,
      email,
      teamType,
      state,
      checkIn,
      checkOut,
      stayDuration,
      // doubleRooms,
      // tripleRooms,
      // totalMembers,
      // totalRooms,
      // memberDetails,
      hotel: hotelId,
      hotelId,
      hotelName,
      totalPrice,
      orderId,
      paymentStatus: "PENDING"
    });

    await newAthlete.save();

    // Create Cashfree payment session
    const cashfreeResponse = await axios.post(
      process.env.CASHFREE_API_URL,
      {
        order_id: orderId,
        order_amount: totalPrice,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST-${Date.now()}`,
          customer_name: name,
          customer_email: email,
          customer_phone: mobileNumber,
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/international-athlete-success?order_id=${orderId}`,
          // return_url: `${process.env.BACKEND_URL}/api/international-athletes/status/${orderId}`,
          notify_url: `${process.env.BACKEND_URL}/api/international-athletes/status/${orderId}`,
          payment_methods: 'cc,dc,upi,nb'
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": process.env.CASHFREE_API_VERSION
        }
      }
    );

    res.json({
      success: true,
      sessionId: cashfreeResponse.data.payment_session_id,
      order_id: orderId
    });

  } catch (error) {
    console.error("Detailed Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 
             error.message || 
             "Registration failed. Please check server logs for details."
    });
  }
};

const checkStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    // console.log(`Checking payment status for order: ${order_id}`);
    
    // Verify payment with Cashfree
    const response = await axios.get(
      `${process.env.CASHFREE_API_URL}/${order_id}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": process.env.CASHFREE_API_VERSION
        }
      }
    );

    const paymentStatus = response.data[0]?.payment_status || 'PENDING';
    // console.log(`Payment status for ${order_id}: ${paymentStatus}`);
    
    const booking = await InternationalAthlete.findOne({ orderId: order_id });
    
    if (!booking) {
      console.error(`Booking not found for order: ${order_id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    if (paymentStatus === 'SUCCESS') {
      // Only update if payment is successful and not already updated
      if (booking.paymentStatus !== 'PAID') {
        // console.log(`Updating room availability for hotel: ${booking.hotelId}`);
        
        try {
          // Update room availability
          const updatedHotel = await Accommodation.findOneAndUpdate(
            { 
              _id: booking.hotelId,
              type: 'hotel'
            },
            { 
              $inc: { availableRooms: -booking.totalRooms },
              $set: { updatedAt: new Date() }
            },
            { new: true }
          );

          if (!updatedHotel) {
            console.error(`Hotel not found or not a hotel type: ${booking.hotelId}`);
          } else {
            console.log(`Successfully updated hotel ${updatedHotel.name}. New available rooms: ${updatedHotel.availableRooms}`);
          }
        } catch (error) {
          console.error("Error updating hotel availability:", error);
        }

        // Update booking status
        await InternationalAthlete.findOneAndUpdate(
          { orderId: order_id },
          { paymentStatus: 'PAID' },
          { new: true }
        );
        console.log(`Booking ${order_id} marked as PAID`);
      }

      return res.redirect(
        `${process.env.FRONTEND_URL}/international-athlete-success?order_id=${order_id}`
      );
    } else {
      await InternationalAthlete.findOneAndUpdate(
        { orderId: order_id },
        { paymentStatus: 'FAILED' },
        { new: true }
      );
      console.log(`Booking ${order_id} marked as FAILED`);
      
      return res.redirect(
        `${process.env.FRONTEND_URL}/international-athlete-failure?order_id=${order_id}`
      );
    }
  } catch (error) {
    console.error("Status Check Error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/international-athlete-failure?error=status_check_failed`
    );
  }
};
const getInternationalAthleteDetails = async (req, res) => {
  const { order_id } = req.params;

  try {
    const booking = await InternationalAthlete.findOne({ orderId: order_id });
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // If payment is still pending, verify with Cashfree
    if (booking.paymentStatus === 'PENDING') {
      try {
        const response = await axios.get(
          `${process.env.CASHFREE_API_URL}/${order_id}/payments`,
          {
            headers: {
              "x-client-id": process.env.CASHFREE_CLIENT_ID,
              "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
              "x-api-version": process.env.CASHFREE_API_VERSION
            }
          }
        );

        const paymentStatus = response.data[0]?.payment_status || 'PENDING';
        if (paymentStatus === 'SUCCESS') {
          // Update booking status if payment was successful
          await InternationalAthlete.findOneAndUpdate(
            { orderId: order_id },
            { paymentStatus: 'PAID' }
          );
          booking.paymentStatus = 'PAID';
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    }

    res.json({ 
      success: true, 
      data: booking 
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// const getInternationalAthleteDetails = async (req, res) => {
//   const { order_id } = req.params;

//   try {
//     const booking = await InternationalAthlete.findOne({ orderId: order_id });
//     if (!booking) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Booking not found" 
//       });
//     }

//     res.json({ 
//       success: true, 
//       data: booking 
//     });
//   } catch (error) {
//     console.error("Error fetching booking:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Internal server error" 
//     });
//   }
// };

const updateRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomsBooked } = req.body;

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ 
        success: false, 
        message: "Accommodation not found" 
      });
    }

    // Prevent negative availability
    if (accommodation.availableRooms < roomsBooked) {
      return res.status(400).json({ 
        success: false, 
        message: "Not enough rooms available",
        availableRooms: accommodation.availableRooms
      });
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      { $inc: { availableRooms: -roomsBooked } },
      { new: true }
    );

    res.json({ 
      success: true, 
      availableRooms: updatedAccommodation.availableRooms 
    });
  } catch (error) {
    console.error("Error updating room availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

const exportInternationalAthletes = async (req, res) => {
  try {
    console.log('Export endpoint accessed'); // Debug log
    
    // Fetch data from database
    const athletes = await InternationalAthlete.find({})
      .sort({ createdAt: -1 })
      .lean();

    if (!athletes || athletes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No international athlete data found"
      });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('International Athletes');

    // Set columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile', key: 'mobileNumber', width: 20 },
      { header: 'Team Type', key: 'teamType', width: 15 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'Check-In', key: 'checkIn', width: 15 },
      { header: 'Check-Out', key: 'checkOut', width: 15 },
      { header: 'Nights', key: 'stayDuration', width: 10 },
      { header: 'Hotel', key: 'hotelName', width: 30 },
      { header: 'Price (₹)', key: 'totalPrice', width: 15 },
      { header: 'Status', key: 'paymentStatus', width: 15 },
      { header: 'Booking Date', key: 'createdAt', width: 20 }
    ];

    // Add data rows
    athletes.forEach(athlete => {
      worksheet.addRow({
        _id: athlete._id.toString(),
        name: athlete.name,
        email: athlete.email,
        mobileNumber: athlete.mobileNumber,
        teamType: athlete.teamType,
        state: athlete.state,
        checkIn: athlete.checkIn.toISOString().split('T')[0],
        checkOut: athlete.checkOut.toISOString().split('T')[0],
        stayDuration: athlete.stayDuration,
        hotelName: athlete.hotelName,
        totalPrice: athlete.totalPrice,
        paymentStatus: athlete.paymentStatus,
        createdAt: athlete.createdAt.toISOString().split('T')[0]
      });
    });

    // Style header row
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=international_athletes_${Date.now()}.xlsx`
    );

    // Send the file
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Excel export',
      error: error.message
    });
  }
};
module.exports = {
  createInternationalAthlete,
  checkStatus,
  getInternationalAthleteDetails,
  updateRoomAvailability,
  exportInternationalAthletes
};
