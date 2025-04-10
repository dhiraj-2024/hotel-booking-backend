import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../MAG_WAG_booking_compnents/Home/Home.css'; // Reuse the same styles
import logo from '../../MAG_WAG_booking_compnents/imageall/logo.jpeg';
import logo2 from '../../MAG_WAG_booking_compnents/imageall/logo2.jpeg';
import ContactUs from '../../ContactForm/ContactUs';
import TermsAndConditions from '../../TermsAndConditions/TermsAndConditions';

const InternationalHome = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/accommodations');
        if (!response.ok) {
          throw new Error('Failed to fetch accommodations');
        }
        const data = await response.json();
        // Filter only hotels
        const hotelData = data.filter(acc => acc.type === 'hotel').map(hotel => ({
          ...hotel,
          // Override price options for international athletes
          priceOptions: [
            { nights: 4, persons: 2, price: 100 },
            { nights: 4, persons: 3, price: 100 },
            { nights: 5, persons: 2, price: 200 },
            { nights: 5, persons: 3, price: 200 }
          ],
          // Add specific note for international athletes
          notes: [
            '🔷 Eligibility: Accommodation is available for International Players (participated in FIG Recognized Competitions in Artistic Gymnastics) attending the Nationals either as a Gymnast or a Coach.Their name must appear in the Nominative Registration submitted by a State or Union Territory, excluding SSCB and Railways.',
            '🔷 Accommodation Type:Eligible individuals will be provided Hotel accommodation on a Twin or Triple sharing basis.',
            '🔶 All accommodation applications will be verified for eligibility after submission.',
            '🔶 If the applicant meets the eligibility criteria, a confirmation of reservation will be sent via email or message.',
            '🔶 If the applicant is found ineligible, the reservation will not be provided, and they will be informed accordingly.',
            '⚠️ Important: In case of ineligibility, the Booking Fee will be forfeited and not refunded.',
            ...(hotel.notes || [])
          ]
        }));
        setHotels(hotelData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // const formatPriceOptions = (priceOptions, nights) => {
  //   return priceOptions
  //     .filter(option => option.nights === nights)
  //     .map(option => `${option.persons} Person - ₹${option.price.toLocaleString()}`)
  //     .join(' / ');
  // };

  const handleBookNow = (hotel) => {
    if (hotel.availableRooms > 0) {
      navigate(`/international-athlete-booking/${hotel._id}`, { state: { hotel } });
    } else {
      alert('No available rooms for this hotel.');
    }
  };

  if (loading) return <div className="loading">Loading hotels...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>

      <div className="containers">
        <div className="heading-container">
          <a href="https://mahagymnastics.com/" target='_blank' rel='noreferrer'>
            <img src={logo2} alt="Logo" className="logo" />
          </a>
          <div>
            <h1>International Athletes - Accommodation Booking</h1>
            <h2>Pune, Maharashtra - 25th April to 3rd May 2025</h2>
            <h3>Venue: Gymnastics Hall, Shivchatrapati Sports Complex, Mahalunge - Balewadi, Pune - 45</h3>
          </div>
          <a href="https://mahagymnastics.com/" target='_blank' rel='noreferrer'>
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>

        <div className="hotel-list">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} className="hotel-image" />
              <h2>{hotel.name}</h2>
              <p>{hotel.description}</p>
              
              <div className="price-section">
                <h4>4 Nights Pricing [Per Room] :</h4>
                <p>Booking Fee: ₹100 per person</p>
                
                <h4>5 Nights Pricing [Per Room]:</h4>
                <p>Booking Fee: ₹200 per person</p>
              </div>
              
              {/* <div className="availability-section">
                <p><strong>Available Rooms:</strong> {hotel.availableRooms}</p>
                <p><strong>Max Booking:</strong> {hotel.bookingLimit} rooms per person</p>
              </div> */}
              
              {hotel.notes && hotel.notes.length > 0 && (
                <div className="notes-section">
                  <h4>Important Notes:</h4>
                  <ul>
                    {hotel.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button 
                onClick={() => handleBookNow(hotel)} 
                className={`button-70 ${hotel.availableRooms === 0 ? 'disabled' : ''}`}
                disabled={hotel.availableRooms === 0}
              >
                {hotel.availableRooms > 0 ? 'Book Now' : 'No Rooms Available'}
              </button>
            </div>
          ))}
        </div>
        <TermsAndConditions/>
        <ContactUs />
      </div>
    </div>
  );
};

export default InternationalHome;