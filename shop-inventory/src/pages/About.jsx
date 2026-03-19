import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#0d9488', color: 'white', padding: '80px 20px', textAlign: 'center', borderBottom: '4px solid #ea580c' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 20px 0', letterSpacing: '-1px' }}>
          Our Legacy of Clean
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', color: '#ccfbf1' }}>
          For over 15 years, Vinod Enterprises has been the invisible force behind Delhi NCR's most pristine commercial and residential spaces.
        </p>
      </div>

      {/* The Story Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        
        <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px', borderTop: '6px solid #0f172a' }}>
          <h2 style={{ color: '#0f172a', fontSize: '2.2rem', marginBottom: '20px', fontWeight: '800' }}>A Decade and a Half of Excellence</h2>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '20px' }}>
            What started as a localized effort to provide high-quality, reliable housekeeping chemicals has evolved into an industry-leading enterprise. Over the last 15+ years, we have relentlessly refined our formulas, rigorously tested our supply chains, and built a brand synonymous with unwavering quality.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem' }}>
            To date, we have successfully fulfilled over <strong>100,000+ orders</strong> across Delhi, Noida, Gurugram, Faridabad, and Ghaziabad. From massive corporate facilities requiring bulk drum supplies to meticulous homeowners seeking professional-grade results, our commitment remains the same: <strong>Provide the magic that makes cleaning effortless.</strong>
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧪</div>
            <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Scientific Precision</h3>
            <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1rem' }}>
              Our "Magic" line is scientifically formulated to cut through the toughest organic and inorganic grime, while strictly maintaining the structural integrity of your valuable surfaces.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚚</div>
            <h3 style={{ color: '#0f172a', marginBottom: '15px' }}>Hyper-Local Focus</h3>
            <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1rem' }}>
              By restricting our operations strictly to the NCR region, we avoid the logistical nightmares of national shipping. This means you get your essential chemicals faster, safer, and cheaper.
            </p>
          </div>

        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '40px' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '2rem' }}>Ready to partner with the experts?</h2>
          <Link to="/products" style={{ display: 'inline-block', padding: '16px 45px', backgroundColor: '#ea580c', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: '800', fontSize: '1.2rem', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)' }}>
            Shop the Magic Collection
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;