import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // In a real application, this would send data to a server
    // For now, we'll just show a success message
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have a question or need help? Get in touch with us!
        </p>

        <div className="contact-content">
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {submitted && (
              <div className="alert alert-success">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            {error && (
              <div className="alert alert-error">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>

          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-info">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>events@college.edu</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>(555) 123-4567</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>123 College Street<br />City, State 12345</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕐</span>
                <div>
                  <strong>Office Hours</strong>
                  <p>Monday - Friday: 9:00 AM - 5:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                  Facebook
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                </a>
              </div>
            </div>

         <div className="campus-map">
  <h3>Campus Map</h3>
  <div className="map-embed" style={{ width: "100%", height: "300px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
    <iframe
      title="LIET Campus Map"
      src="https://maps.app.goo.gl/pJssiFY1k79ZL6Ws6"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      allowFullScreen=""
      aria-hidden="false"
      tabIndex="0"
    ></iframe>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

