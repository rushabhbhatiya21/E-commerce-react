import React from 'react';
import './Footer.css'; // Import the CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="footer-title">SmartMart</h2>
          <p>
            Discover a superior shopping experience with SmartMart. We bring you a diverse selection of products designed to exceed your expectations, emphasizing quality, innovation, and customer satisfaction.
          </p>
        </div>
        <div className="footer-section contact">
          <h2 className="footer-title">Contact Us</h2>
          <p>Email: contact@smartmart.com</p>
          <p>Phone: +91 9856231476</p>
          <p>Address: 123 Commerce Blvd, Shopville, SH 45678</p>
        </div>
        <div className="footer-section links">
          <h2 className="footer-title">Quick Links</h2>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SmartMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
