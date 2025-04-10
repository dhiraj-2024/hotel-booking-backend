// src/components/MAG_WAG_booking_compnents/BookingStatus/BookingStatus.js
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BookingStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8888/api/bookings/status/${orderId}`);
        if (response.redirected) {
          window.location.href = response.url; // Follow the backend redirect
        } else {
          navigate('/failure');
        }
      } catch (error) {
        navigate('/failure');
      }
    };

    if (orderId) {
      checkPaymentStatus();
    } else {
      navigate('/failure');
    }
  }, [orderId, navigate]);

  return <div>Processing your payment...</div>;
};

export default BookingStatus;