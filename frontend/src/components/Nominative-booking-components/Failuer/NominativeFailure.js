// src/pages/NominativeFailure.js
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './NominativeFailure.css';

const NominativeFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch(error) {
      case 'payment_failed':
        return "Your payment was unsuccessful. Please try again.";
      case 'status_check_failed':
        return "We couldn't verify your payment status. Please contact support.";
      default:
        return "An unexpected error occurred during your registration.";
    }
  };

  return (
    <div className="nominative-failure-page">
      <div className="failure-container">
        <div className="failure-icon">✕</div>
        <h1>Registration Failed</h1>
        <p className="error-message">{getErrorMessage()}</p>
        
        {orderId && (
          <div className="reference-id">
            <p>Reference ID: <strong>{orderId}</strong></p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="retry-button"
            onClick={() => window.location.href = '/nominative-booking'}
          >
            Try Again
          </button>
          <a href="/" className="contact-support">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default NominativeFailure;