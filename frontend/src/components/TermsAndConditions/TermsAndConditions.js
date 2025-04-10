// path: /Users/rajputdhiraj/Desktop/new-hotel-booking-copy/frontend/src/components/TermsAndConditions/TermsAndConditions.js
import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div>
    {/* <Header/> */}
    <div className="terms-container" id='terms-and-condition'>
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>Accommodation Terms</h2>
          <div className="terms-card">
            <div className="term-item">
              <div className="term-icon">⏰</div>
              <div>
                <h3>Check-in/Check-out Times</h3>
                <ul>
                  <li>Check-in time: <strong>12:00 PM</strong></li>
                  <li>Check-out time: <strong>11:00 AM</strong></li>
                  <li>Early check-in & late check-out: Subject to availability and additional charges</li>
                </ul>
              </div>
            </div>

            <div className="term-item">
              <div className="term-icon">💰</div>
              <div>
                <h3>Payment Policy</h3>
                <ul>
                  <li>Full payment required at the time of booking</li>
                  <li>Security Deposit: <strong>₹1,000</strong> refundable deposit per room to be paid at check-in</li>
                </ul>
              </div>
            </div>

            <div className="term-item">
              <div className="term-icon">❌</div>
              <div>
                <h3>Cancellation Policy</h3>
                <ul>
                  <li><strong>No Cancellations or Refunds:</strong> Once booked, no refunds will be issued</li>
                </ul>
              </div>
            </div>

            <div className="term-item">
              <div className="term-icon">⚠️</div>
              <div>
                <h3>Guest Responsibilities</h3>
                <ul>
                  <li>Guests are responsible for their belongings; management is not liable for lost or stolen items</li>
                  <li>Any damage to the property caused by guests will be chargeable</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="terms-footer">
        <p>By proceeding with your booking, you acknowledge that you have read, understood, and agree to these Terms & Conditions.</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Back to Booking
        </button>
      </div>
    </div>
    </div>
  );
};

export default TermsAndConditions;