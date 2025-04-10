// src/pages/InternationalAthleteFailure.js
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './InternationalAthleteFailure.css';

const InternationalAthleteFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    if (error === 'status_check') return "We couldn't verify your payment status";
    if (error === 'payment_failed') return "Your payment was unsuccessful";
    return "An unexpected error occurred";
  };

  return (
    <div className="failure-page">
      <div className="failure-container">
        <div className="failure-icon">❌</div>
        <h1>Payment Failed</h1>
        <p className="error-message">{getErrorMessage()}</p>
        
        {orderId && (
          <div className="order-details">
            <p>Reference ID: <strong>{orderId}</strong></p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/international-athlete-booking'}
          >
            Try Again
          </button>
          <a href="/" className="home-link">Return to Home</a>
        </div>
      </div>
    </div>
  );
};

export default InternationalAthleteFailure;