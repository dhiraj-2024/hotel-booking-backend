// src/pages/BookingPortal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../BookingPortal/BookingPortal.css';


const Admin = () => {
  const navigate = useNavigate();

  const bookingOptions = [
    {
      title: "WAG/MAG Booking",
      route: "/export-bookings",
       description: "Export All (MAG / WAG) Booking Data Into Excel sheet ",

      icon: "🛋️",
      bgColor: "linear-gradient(135deg,rgb(67, 139, 233) 0%,rgb(56, 249, 188) 100%)"
    },
    {
      title: "International Athlete",
      route: "/export-bookings-int",
      description: "Export All (International Athlete) Booking Data Into Excel sheet ",

      icon: "🌍",
       bgColor: "linear-gradient(135deg,rgb(145, 91, 252) 0%,rgb(200, 184, 255) 100%)"
    },
    // {
    //   title: "Nominative Entry",
    //   description: "Register for nominative entries (judges, coaches, etc.)",
    //   route: "/nominative-booking",
    //   icon: "📋",
    //   bgColor: "linear-gradient(135deg,rgb(233, 158, 67) 0%,rgb(141, 61, 184) 100%)"
    // },
  ];

  return (

     <div className="booking-portal-page">
      
       <div className="portal-hero">
          <h1>Junior & Senior Artistic Gymnastics National Championships</h1>
          <h2>Pune, Maharashtra - 25th April to 3rd May 2025</h2>
          <h3>Nationals 2025-26</h3>
      </div>

      <div className="booking-options-container">
        {bookingOptions.map((option, index) => (
          <div 
            key={index}
            className="booking-card"
            onClick={() => navigate(option.route)}
            style={{ background: option.bgColor }}
          >
            <div className="card-icon">{option.icon}</div>
            <h3>{option.title}</h3>
            <h4>{option.description}</h4>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>
    </div>


  );
};

export default Admin;