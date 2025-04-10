import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("access_key", "7b4a7bed-27f4-4a6d-89b2-dcd06e92ebf9"); // Replace with your actual access key
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formDataToSend))
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(result.message || "Failed to submit form. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">Have questions about your booking? Get in touch with us.</p>
      </div>

      <div className="contact-content">
        <section className="contact-form-section">
          <div className="contact-card">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="success-message">
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="contact-info-section">
          <div className="contact-card">
            <h2>Direct Contact</h2>
            <div className="contact-info">
              <div className="contact-item">
                <div>
                  <h3>Mr. Shubham Rajput</h3>
                </div>
              </div>

              <div className="contact-item">
                <div>
                  <h3>Mobile</h3>
                  <p>+91 93707 19213</p>
                </div>
              </div>

              <div className="contact-item">
                <div>
                  <h3>Email</h3>
                  <p>Pune2025.ART@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="operating-hours">
              <h3>Operating Hours</h3>
              <p>Monday - Sunday: 8:00 AM to 10:00 PM</p>
            </div>
          </div>
        </section>
      </div>

      <div className="contact-footer">
        <p>We typically respond to inquiries within 24 hours.</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Back to Previous Page
        </button>
      </div>
    </div>
  );
};

export default ContactUs;