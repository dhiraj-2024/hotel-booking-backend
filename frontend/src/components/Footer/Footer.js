import React from 'react';
import './Footer.css';
import logo2 from "../MAG_WAG_booking_compnents/imageall/logo_transperent.png";
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:code.dhiraj18@gmail.com';
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/">
            <img src={logo2} alt="Logo" className='logo' />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-section">
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Copyright and Credit */}
        <div className="info-section">
          <div className="website-link">
            <a href="https://gymnazien.com" target="_blank" rel="noopener noreferrer">
              By Gymnazien.com
            </a>
          </div>
          <div className="watermark" onClick={handleEmailClick}>
            Contact us for design and development services
          </div>
          <p>code.dhiraj18@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;