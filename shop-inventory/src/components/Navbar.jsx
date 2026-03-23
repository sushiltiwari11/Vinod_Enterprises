import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

// --- CUSTOM SVG ICONS ---
const BrandLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '20px', flexShrink: 0 }}>
    <rect width="100" height="100" rx="22" fill="#0f172a"/>
    <path d="M25 35 L50 75 L75 35 L60 35 L50 53 L40 35 Z" fill="#ccfbf1"/>
    <path d="M50 12 L53 22 L63 25 L53 28 L50 38 L47 28 L37 25 L47 22 Z" fill="#ea580c"/>
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'vinodenterprisesmagic@gmail.com';

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
    setMobileMenuOpen(false);
    localStorage.removeItem("isAuth");
    navigate('/login');
  };

  return (
    <>
      {/* CSS Block - Handles Mobile vs Desktop visibility */}
      <style>{`
        body { margin: 0; padding: 0; box-sizing: border-box; background-color: #f8fafc; }
        .nav-link { color: #ccfbf1; text-decoration: none; font-size: 1rem; font-weight: 600; transition: all 0.2s ease; }
        .nav-link:hover { color: #ffffff; transform: translateY(-1px); }
        .drop-link { display: block; padding: 12px 20px; text-decoration: none; color: #334155; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        
        /* Default Desktop Layout */
        .desktop-menu { display: flex; align-items: center; gap: 30px; }
        .mobile-hamburger { display: none; background: none; border: none; cursor: pointer; align-items: center; justify-content: center; padding: 5px; }
        
        /* Mobile Layout */
        @media (max-width: 768px) {
          .desktop-menu { display: none; } /* Hide normal menu on phones */
          .mobile-hamburger { display: flex; } /* Show hamburger icon ONLY on phones */
          .nav-container { padding: 0 20px !important; }
          .brand-text { font-size: 1.2rem !important; }
        }
      `}</style>

      {/* --- TOP NAVBAR --- */}
      <nav className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', height: '75px', backgroundColor: '#0d9488', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 15px rgba(13, 148, 136, 0.2)' }}>
        
        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontWeight: '900', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center' }}>
          <BrandLogo /> <span className="brand-text" style={{ fontSize: '1.6rem' }}>Vinod Enterprises</span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', color: '#0f172a', padding: '8px 18px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <CartIcon /> Cart
          </Link>
          
          <div style={{ position: 'relative' }}>
            {!user ? (
              <Link to="/login" style={{ backgroundColor: '#ea580c', color: 'white', padding: '10px 24px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}>
                Login
              </Link>
            ) : (
              <button onClick={() => setShowDropdown(!showDropdown)} style={{ backgroundColor: 'white', color: '#0f172a', border: 'none', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <AccountIcon /> Account ▼
              </button>
            )}

            {/* Desktop Dropdown */}
            {showDropdown && user && (
              <div style={{ position: 'absolute', right: 0, top: '55px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', width: '220px', overflow: 'hidden' }}>
                <div style={{ padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b', wordBreak: 'break-all' }}>
                  {user.email}
                </div>
                {user.email === ADMIN_EMAIL && (
                  <Link to="/admin" onClick={() => setShowDropdown(false)} style={{ padding: '15px 20px', textDecoration: 'none', color: 'white', backgroundColor: '#0f172a', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    Admin Command <span>⚡</span>
                  </Link>
                )}
                <Link to="/profile" className="drop-link" onClick={() => setShowDropdown(false)}>👤 My Profile</Link>
                <Link to="/orders" className="drop-link" onClick={() => setShowDropdown(false)}>📦 Order History</Link>
                
                {/* Add these two new lines right here! */}
                <Link to="/addresses" className="drop-link" onClick={() => setShowDropdown(false)}>📍 Saved Addresses</Link>
                <Link to="/payments" className="drop-link" onClick={() => setShowDropdown(false)}>💳 Payment Methods</Link>
                <button onClick={handleLogout} style={{ padding: '15px 20px', color: '#ef4444', background: '#fef2f2', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: '700', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  Logout <span>🚪</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        {/* Notice how there is no inline style={{display: 'flex'}} here anymore! */}
        <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            /* Close "X" Icon */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            /* Hamburger Menu Icon */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '75px', left: 0, right: 0, bottom: 0, backgroundColor: '#0f172a', zIndex: 999, padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>Products</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '1.5rem', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>About</Link>
          
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ea580c', fontSize: '1.5rem', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            View Cart
          </Link>
          
          {!user ? (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ backgroundColor: '#ea580c', color: 'white', padding: '15px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', textAlign: 'center', marginTop: '20px' }}>
              Login / Register
            </Link>
          ) : (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Signed in as: <br/><strong style={{color: 'white', wordBreak: 'break-all'}}>{user.email}</strong>
              </div>
              
              {user.email === ADMIN_EMAIL && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fef08a', fontSize: '1.2rem', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px' }}>
                  ⚡ Admin Command
                </Link>
              )}
              
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', fontSize: '1.2rem', textDecoration: 'none', marginTop: '10px' }}>👤 My Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', fontSize: '1.2rem', textDecoration: 'none' }}>📦 Order History</Link>
              {/* Add these two new lines right here! */}
              <Link to="/addresses" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', fontSize: '1.2rem', textDecoration: 'none' }}>📍 Saved Addresses</Link>
              <Link to="/payments" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', fontSize: '1.2rem', textDecoration: 'none' }}>💳 Payment Methods</Link>
              
              <button onClick={handleLogout} style={{ color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: '700', fontSize: '1.2rem', padding: 0, marginTop: '20px' }}>
                Secure Logout 🚪
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;