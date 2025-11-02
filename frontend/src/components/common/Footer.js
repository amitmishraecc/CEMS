import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>College Events</h3>
          <p>Your one-stop destination for all college events and activities.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: amitmishramca24-26@liet.in</p>
          <p>Phone: 7388023729</p>
          <p>Address: KP-2, Greater Noida, UP 201306</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 College Event Management System. All rights reserved Managed BY - AMIT||KAJAL||DEEKSHA.</p>
      </div>
    </footer>
  );
};

export default Footer;

