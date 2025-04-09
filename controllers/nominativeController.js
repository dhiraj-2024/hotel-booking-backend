// backend/controllers/nominativeController.js
const Nominative = require("../models/Nominative");
const axios = require("axios");

const createNominativeEntry = async (req, res) => {
  try {
    const { 
      name, role, state, mobileNumber,dateOfBirth,registrationFee    // email, teamName removed
    } = req.body;


    if (!dateOfBirth || isNaN(new Date(dateOfBirth).getTime())) {
        return res.status(400).json({ 
          success: false,
          message: "Valid date of birth is required" 
        });
      }
  
    const orderId = `NOM-${Date.now()}`;

    const newNominative = new Nominative({
      name,
      role,
      state,
      mobileNumber,
      dateOfBirth: new Date(dateOfBirth), 
    //   email,
    //   teamName,
      registrationFee,
      paymentStatus: role === "judge" ? "FREE" : "PENDING",
      orderId
    });

    await newNominative.save();

    if (role === "judge") {
      return res.json({
        success: true,
        order_id: orderId
      });
    }

    // Proceed with payment for other roles
    const cashfreeResponse = await axios.post(process.env.CASHFREE_API_URL,
      {
        order_id: orderId,
        order_amount: registrationFee,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST-${Date.now()}`,
          customer_name: name,
        //   customer_email: email,
          customer_phone: mobileNumber,
        },
        order_meta: {
          return_url: `${process.env.BACKEND_URL}/api/nominative/status/${orderId}`,  
          notify_url: `${process.env.BACKEND_URL}/api/nominative/status/${orderId}`,  
          payment_methods: 'cc,dc,upi',
          order_type: "nominative_entry" 
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
    console.error("Nominative Entry Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || "Nominative entry creation failed" 
    });
  }
};

const checkNominativeStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

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
    
    await Nominative.findOneAndUpdate(
      { orderId: order_id },
      { paymentStatus: paymentStatus === 'SUCCESS' ? 'PAID' : 'FAILED' }
    );

    if (paymentStatus === 'SUCCESS') {
      return res.redirect(`${process.env.FRONTEND_URL}/nominative-success?order_id=${order_id}`);  
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/nominative-failure?order_id=${order_id}`);  
    }

  } catch (error) {
    console.error("Nominative Status Check Error:", error.response?.data || error.message);
    return res.redirect(`${process.env.FRONTEND_URL}/nominative-failure?error=status_check_failed`);  
  }
};

const getNominativeDetails = async (req, res) => {
  try {
    const { order_id } = req.params;
    const nominative = await Nominative.findOne({ orderId: order_id });

    if (!nominative) {
      return res.status(404).json({ message: "Nominative entry not found" });
    }

    res.json(nominative);
  } catch (error) {
    console.error("Error fetching nominative details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNominativeEntry,
  checkNominativeStatus,
  getNominativeDetails
};