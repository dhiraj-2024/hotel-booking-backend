import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./InternationalAthleteSuccess.css";


const InternationalAthleteSuccess = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");


  // Add this useEffect to your success component
useEffect(() => {
  if (!orderId) {
    setLoading(false);
    return;
  }

  const fetchData = async () => {
    try {
      // First get booking details
      const bookingResponse = await axios.get(
        `http://localhost:8888/api/international-athletes/${orderId}`
      );
      
      if (bookingResponse.data.success) {
        setBookingDetails(bookingResponse.data.data);
        
        // Then refresh hotel data
        const hotelResponse = await axios.get(
          `http://localhost:8888/api/accommodations/${bookingResponse.data.data.hotelId}`
        );
        
        // You can update your global state here if needed
        console.log('Updated hotel data:', hotelResponse.data);
      } else {
        throw new Error(bookingResponse.data.message || "Booking not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [orderId]);

  return (
    <div className="invoice-container">
      <h2 className="invoice-title">Payment Successful!</h2>
      {loading ? (
        <p>Loading booking details...</p>
      ) : bookingDetails ? (
        <div className="invoice">
          <h3>Booking Invoice</h3>
          <div className="invoice-header">
            <div className="company-details">
              <p><strong>Gymnazien</strong></p>
              <p>Mr. Shubham Rajput</p>
              <p>Mobile: +91 93707 19213</p>
              <p>Email: Pune2025.ART@gmail.com</p>
            </div>
            <div className="invoice-meta">
              <p><strong>Invoice Number:</strong> {orderId}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="invoice-details">
            <p><strong>Name:</strong> {bookingDetails.name}</p>
            <p><strong>Type : </strong> {bookingDetails.hotelName}</p>
            <p><strong>Check-in Date :</strong> {bookingDetails.checkIn}</p>
            <p><strong>Check-out Date :</strong> {bookingDetails.checkOut}</p>
            <p><strong>Total Rooms:</strong> {bookingDetails.totalRooms}</p>
            <p><strong>Selected Members:</strong></p>
            
            {bookingDetails.memberDetails && bookingDetails.memberDetails.length > 0 ? (
              <table className="members-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Member Name</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.memberDetails.map((member, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{member.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No members selected.</p>
            )}

            <p><strong>Total Price:</strong> ₹{bookingDetails.totalPrice}</p>
          </div>

          <button className="download-button" onClick={() => window.print()}>
            Download Invoice
          </button>
        </div>
      ) : (
        <p>Booking details not found.</p>
      )}
      <a className="home-link" href="/">Back to Home</a>
    </div>
  );
};

export default InternationalAthleteSuccess;