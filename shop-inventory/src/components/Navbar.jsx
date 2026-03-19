import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// --- NEW PROFESSIONAL SVG ICONS ---
const BrandLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '20px' }}>
    {/* Deep Navy Blue Background */}
    <rect width="100" height="100" rx="22" fill="#0f172a"/>
    
    {/* The Geometric 'V' */}
    <path d="M25 35 L50 75 L75 35 L60 35 L50 53 L40 35 Z" fill="#ccfbf1"/>
    
    {/* The Magic Orange Sparkle */}
    <path d="M50 12 L53 22 L63 25 L53 28 L50 38 L47 28 L37 25 L47 22 Z" fill="#ea580c"/>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

// The requested Blue Account Icon
const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'sushilkumartiwari2004@gmail.com';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => setUser(session?.user || null));
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    localStorage.removeItem("isAuth");
    navigate('/login');
  };

  return (
    <>
      <style>{`
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: #f8fafc; }
        .nav-link { color: #ccfbf1; text-decoration: none; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; }
        .nav-link:hover { color: #ffffff; transform: translateY(-1px); }
        .drop-link { display: block; padding: 12px 20px; text-decoration: none; color: #334155; border-bottom: 1px solid #f1f5f9; transition: all 0.2s ease; font-weight: 500; }
        .drop-link:hover { background-color: #f0fdfa; color: #0d9488; padding-left: 25px; }
      `}</style>

      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 40px', height: '75px', backgroundColor: '#0d9488', 
        position: 'sticky', top: 0, left: 0, right: 0, 
        width: '100%', boxSizing: 'border-box', zIndex: 1000,
        boxShadow: '0 4px 15px rgba(13, 148, 136, 0.2)'
      }}>
        
        {/* BRAND LOGO - Now using a crisp dark SVG */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrandLogo/> Vinod Enterprises
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          {/* CART BUTTON - Now a sharp white pill with dark text and SVG */}
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', color: '#0f172a', padding: '8px 18px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
          >
            <CartIcon /> Cart
          </Link>
          
          <div style={{ marginLeft: '10px' }}>
            {!user ? (
              <Link to="/login" style={{ backgroundColor: '#ea580c', color: 'white', padding: '10px 24px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}>
                Login / Register
              </Link>
            ) : (
              <div style={{ position: 'relative' }}>
                
                {/* ACCOUNT BUTTON - White pill with the new Blue Icon */}
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ backgroundColor: 'white', color: '#0f172a', border: 'none', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <AccountIcon /> Account ▼
                </button>

                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: '55px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', width: '240px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Signed in</span><br/>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem', wordBreak: 'break-all' }}>{user.email}</strong>
                    </div>

                    {user.email === ADMIN_EMAIL && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} style={{ padding: '15px 20px', textDecoration: 'none', color: 'white', backgroundColor: '#0f172a', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Admin Command <span>⚡</span>
                      </Link>
                    )}

                    <Link to="/profile" className="drop-link" onClick={() => setShowDropdown(false)}>👤 My Profile</Link>
                    <Link to="/orders" className="drop-link" onClick={() => setShowDropdown(false)}>📦 Order History</Link>
                    <Link to="/addresses" className="drop-link" onClick={() => setShowDropdown(false)}>📍 Address Book</Link>
                    <Link to="/payments" className="drop-link" onClick={() => setShowDropdown(false)}>💳 Payment Methods</Link>

                    <button onClick={handleLogout} style={{ padding: '15px 20px', color: '#ef4444', background: '#fef2f2', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: '700', width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                      Secure Logout <span style={{fontSize: '1.2rem'}}>🚪</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;