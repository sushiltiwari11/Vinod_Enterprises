import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  // --- STYLES ---
  const footerBg = {
    backgroundColor: '#003333', // A very dark, professional Teal
    color: '#ffffff',
    padding: '60px 20px 20px 20px',
    fontFamily: 'sans-serif',
    marginTop: 'auto' // Pushes footer to the bottom of the screen
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '40px'
  };

  const linkStyle = {
    color: '#d1d5db', 
    textDecoration: 'none',
    display: 'block',
    marginBottom: '12px',
    transition: 'color 0.2s ease',
    fontSize: '0.95rem'
  };

  const headerStyle = {
    fontSize: '1.2rem', 
    marginBottom: '20px', 
    borderBottom: '2px solid #059669', // Emerald Green accent
    display: 'inline-block', 
    paddingBottom: '5px'
  };

  return (
    <footer style={footerBg}>
      <div style={gridStyle}>
        
        {/* Column 1: Brand Info */}
        <div>
          <h2 style={{ color: '#059669', fontSize: '1.8rem', marginBottom: '15px', fontWeight: '900' }}>
            Vinod Enterprises
          </h2>
          <p style={{ color: '#d1d5db', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Your trusted partner for premium housekeeping materials and industrial-grade chemicals. 
            Experience the magic of a truly clean environment.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 style={headerStyle}>Quick Links</h3>
          {/* We use standard anchor tags or Links here so users can navigate easily */}
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/products" style={linkStyle}>Product Catalog</Link>
          <Link to="/collection" style={linkStyle}>The Magic Collection</Link>
          <Link to="/about" style={linkStyle}>About Us</Link>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 style={headerStyle}>Contact Us</h3>
          <p style={{ color: '#d1d5db', marginBottom: '12px', fontSize: '0.95rem' }}>
            📍 123 Industrial Estate, Business District
          </p>
          <p style={{ color: '#d1d5db', marginBottom: '12px', fontSize: '0.95rem' }}>
            📞 +91 98765 43210
          </p>
          <p style={{ color: '#d1d5db', marginBottom: '12px', fontSize: '0.95rem' }}>
            ✉️ support@vinodenterprises.com
          </p>
        </div>

      </div>

      {/* Bottom Copyright Banner */}
      <div style={{ textAlign: 'center', paddingTop: '20px', color: '#9ca3af', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} Vinod Enterprises. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;