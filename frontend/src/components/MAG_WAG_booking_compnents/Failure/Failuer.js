// path: /Users/rajputdhiraj/Desktop/new-hotel-booking-copy/frontend/src/components/Failure/Failure.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Failure.css";


const Failure = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8888/api/booking/${orderId}`)
      .then(response => {
        setBookingDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching booking details:", error);
        setLoading(false);
      });

    // Set error message based on error parameter
    if (errorParam) {
      switch(errorParam) {
        case 'status_check_failed':
          setErrorMessage("We couldn't verify your payment status. Please contact support.");
          break;
        default:
          setErrorMessage("Payment failed. Please try again.");
      }
    } else {
      setErrorMessage("Payment failed. Please try again.");
    }
  }, [orderId, errorParam]);

  return (
    <div className="failure-container">

      <h2 className="failure-title">Payment Failed!</h2>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {loading ? (
        <p>Loading details...</p>
      ) : bookingDetails ? (
        <div className="booking-details">
          <h3>Booking Information</h3>
          <div className="details-content">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Name:</strong> {bookingDetails.name}</p>
            <p><strong>Team:</strong> {bookingDetails.teamName}</p>
            <p><strong>Hotel:</strong> {bookingDetails.hotelName}</p>
            <p><strong>Room Type:</strong> {bookingDetails.roomType}</p>
            <p><strong>Check-in:</strong> {bookingDetails.checkIn}</p>
            <p><strong>Check-out:</strong> {bookingDetails.checkOut}</p>
            <p><strong>Total Amount:</strong> ₹{bookingDetails.totalPrice}</p>
          </div>

          <div className="action-buttons">
            <button 
              className="retry-button" 
              onClick={() => window.location.href = `/booking/${bookingDetails.hotelId}`}
            >
              Try Again
            </button>
            <button 
              className="contact-button"
              onClick={() => window.location.href = "mailto:support@gymnazien.com"}
            >
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        <p>No booking details found for this order.</p>
      )}
      
      <a className="home-link" href="/">Back to Home</a>
    </div>
  );
};

export default Failure;