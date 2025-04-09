const axios = require("axios");
const generateCashfreePaymentLink = async (booking) => {
  try {
    const response = await axios.post(process.env.CASHFREE_API_URL,
      {
        order_id: `ORD_${Date.now()}`,
        order_amount: booking.totalPrice,
        order_currency: "INR",
        customer_details: {
          customer_email: booking.email,
          customer_phone: booking.mobileNumber,
        },
        order_meta: { return_url: `${process.env.FRONTEND_URL}/payment-success` },
      },
      
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );
    return response.data.payment_link;
  } catch (error) {
    console.error("Cashfree Error:", error);
    throw new Error("Failed to generate Cashfree payment link");
  }
};
module.exports = { generateCashfreePaymentLink };
