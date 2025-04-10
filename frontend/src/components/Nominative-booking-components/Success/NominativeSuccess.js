// src/pages/NominativeSuccess.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './NominativeSuccess.css';

const NominativeSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/api/nominative/${orderId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="nominative-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Registration Successful!</h1>
        <p className="success-message">Thank you for your nominative entry registration.</p>
        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : orderDetails ? (
          <div className="order-details">
            <h3>Registration Details</h3>
            <div className="detail-row">
              <span className="detail-label">Reference ID:</span>
              <span className="detail-value">{orderDetails.orderId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{orderDetails.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="detail-value">
                {orderDetails.role.charAt(0).toUpperCase() + orderDetails.role.slice(1)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${orderDetails.paymentStatus.toLowerCase()}`}>
                {orderDetails.paymentStatus}
              </span>
            </div>
            {orderDetails.paymentStatus === 'PAID' && (
              <div className="detail-row">
                <span className="detail-label">Amount Paid:</span>
                <span className="detail-value">₹{orderDetails.registrationFee}</span>
              </div>
            )}
          </div>
        ) : (
          <p>No order details available</p>
        )}

        <div className="action-buttons">
          <button 
            className="print-button"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
          <a href="/" className="home-button">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NominativeSuccess;