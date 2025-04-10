import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../imageall/logo.jpeg';
import logo2 from '../imageall/logo2.jpeg';
import ContactUs from '../../ContactForm/ContactUs';
import TermsAndConditions from '../../TermsAndConditions/TermsAndConditions';

const Home = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/accommodations');
        if (!response.ok) {
          throw new Error('Failed to fetch accommodations');
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const formatPriceOptions = (priceOptions, nights) => {
    return priceOptions
      .filter(option => option.nights === nights)
      .map(option => `${option.persons} Person - ₹${option.price.toLocaleString()}`)
      .join(' / ');
  };

  const handleBookNow = (accommodation) => {
    if (accommodation.availableRooms > 0) {
      navigate(`/booking/${accommodation._id}`, { state: { accommodation } });
    } else {
      alert('No available rooms for this accommodation.');
    }
  };

  if (loading) return <div className="loading">Loading accommodations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <div className="containers">
        <div className="heading-container">
          <a href="https://mahagymnastics.com/" target='_blank' rel='noreferrer'>
            <img src={logo2} alt="Logo" className="logo" />
          </a>
          <div>
            <h1>Junior & Senior Artistic Gymnastics National Championships</h1>
            <h2>Pune, Maharashtra - 25th April to 3rd May 2025</h2>
            <h3>Venue: Gymnastics Hall, Shivchatrapati Sports Complex, Mahalunge - Balewadi, Pune - 45</h3>
          </div>
          <a href="https://mahagymnastics.com/" target='_blank' rel='noreferrer'>
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>

        <div className="hotel-list">
          {accommodations.map((accommodation) => (
            <div key={accommodation._id} className="hotel-card">
              <img src={accommodation.image} alt={accommodation.name} className="hotel-image" />
              <h2>{accommodation.name}</h2>
              <p>{accommodation.description}</p>
              
              <div className="price-section">
                <h4>4 Nights Pricing [Per Room]:</h4>
                <p>{formatPriceOptions(accommodation.priceOptions, 4)}</p>
                
                <h4>5 Nights Pricing [Per Room] :</h4>
                <p>{formatPriceOptions(accommodation.priceOptions, 5)}</p>
              </div>
              
              <div className="availability-section">
                <p><strong>Available Rooms:</strong> {accommodation.availableRooms}</p>
                {/* <p><strong>Max Booking:</strong> {accommodation.bookingLimit} rooms per person</p> */}
              </div>
              
              {accommodation.notes && accommodation.notes.length > 0 && (
                <div className="notes-section">
                  <h4>Important Notes:</h4>
                  <ul>
                    {accommodation.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button 
                onClick={() => handleBookNow(accommodation)} 
                className={`button-70 ${accommodation.availableRooms === 0 ? 'disabled' : ''}`}
                disabled={accommodation.availableRooms === 0}
              >
                {accommodation.availableRooms > 0 ? 'Book Now' : 'No Rooms Available'}
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

export default Home;