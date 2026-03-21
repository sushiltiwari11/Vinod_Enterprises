import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', overflowX: 'hidden' }}>
      
      {/* 1. RESPONSIVE HERO SECTION */}
      <div style={{ 
        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', 
        color: 'white', 
        padding: 'clamp(50px, 10vw, 100px) 20px clamp(70px, 12vw, 120px) 20px', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow fixed for mobile */}
        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        
        {/* CLAMP FONT SIZE: Shrinks automatically on mobile */}
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', margin: '0 0 20px 0', fontWeight: '900', letterSpacing: '-1.5px', lineHeight: '1.1', position: 'relative', zIndex: 1, textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          Industrial Clean.<br/>
          Unmatched Power.
        </h1>
        
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', maxWidth: '750px', margin: '0 auto 40px auto', lineHeight: '1.6', color: '#ccfbf1', position: 'relative', zIndex: 1 }}>
          Equipping Delhi NCR's top businesses and homes with professional-grade housekeeping chemicals. Delivered fast. Priced right.
        </p>
        
        <Link 
          to="/products" 
          style={{
            backgroundColor: isHovered ? '#c2410c' : '#ea580c',
            color: 'white', padding: '16px clamp(30px, 6vw, 45px)', fontSize: 'clamp(1rem, 4vw, 1.2rem)', fontWeight: '800',
            border: 'none', borderRadius: '50px', cursor: 'pointer', textDecoration: 'none',
            display: 'inline-block', transition: 'all 0.3s ease',
            boxShadow: isHovered ? '0 10px 25px rgba(234, 88, 12, 0.4)' : '0 4px 15px rgba(234, 88, 12, 0.2)',
            transform: isHovered ? 'translateY(-3px)' : 'none',
            position: 'relative', zIndex: 1
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Explore Catalog →
        </Link>
      </div>

      {/* 2. RESPONSIVE TRUST BANNER */}
      <div style={{ backgroundColor: '#0f172a', padding: '40px 20px', position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', gap: 'clamp(30px, 8vw, 80px)', flexWrap: 'wrap', borderTop: '4px solid #ea580c', borderBottom: '1px solid #1e293b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#fef08a', lineHeight: '1' }}>15+</div>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px', fontWeight: 'bold' }}>Years of Trust</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#fef08a', lineHeight: '1' }}>100k+</div>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px', fontWeight: 'bold' }}>Orders Fulfilled</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#fef08a', lineHeight: '1' }}>100%</div>
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px', fontWeight: 'bold' }}>Quality Guarantee</div>
        </div>
      </div>

      {/* 3. SLEEK FEATURE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: 'clamp(40px, 8vw, 80px) 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Same grid items as before, gridTemplateColumns auto-handles mobile wrapping */}
        <div style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>🛡️</div>
          <h3 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '1.4rem' }}>Commercial Grade</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>Formulated with industrial strength for maximum efficacy in high-traffic commercial spaces.</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>📦</div>
          <h3 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '1.4rem' }}>Bulk Supply Ready</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>Engineered logistics to fulfill massive volume orders for enterprise facilities without delay.</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '40px 30px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>⚡</div>
          <h3 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '1.4rem' }}>NCR Express Delivery</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>Hyper-local distribution centers across Delhi, Noida, and Gurugram ensure same-day dispatch.</p>
        </div>
      </div>

      {/* 4. ELEGANT BRAND SPOTLIGHT */}
      <div style={{ backgroundColor: '#f0fdfa', padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center', borderTop: '1px solid #ccfbf1' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '20px', fontWeight: '800', color: '#0f172a' }}>
            Experience the <span style={{ color: '#0d9488' }}>MAGIC</span> Collection
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)', color: '#475569', marginBottom: '40px', lineHeight: '1.8' }}>
            Our signature line of chemicals cuts through the toughest grime while maintaining surface integrity. From floor degreasers to glass purifiers, professionals trust Magic.
          </p>
          <Link to="/products" style={{ color: '#0d9488', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #0d9488', paddingBottom: '4px', fontSize: '1.1rem' }}>
            View Full Inventory →
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Home;