import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NEW: This state tracks if we are logging in or signing up
  const [isSignUp, setIsSignUp] = useState(false); 
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        alert("Account created successfully! You can now log in.");
        setIsSignUp(false); // Switch back to login mode
        setPassword(''); // Clear the password field for safety
        
      } else {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        
        localStorage.setItem("isAuth", "true");
       navigate("/");
      }
    } catch (error) {
      alert((isSignUp ? "Sign Up Error: " : "Login Error: ") + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 10px 0' }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            {isSignUp ? "Join Vinod Enterprises today." : "Enter your details to access your account."}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }}
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', marginTop: '10px',
              backgroundImage: 'linear-gradient(135deg, #0f766e 0%, #042f2e 100%)', 
              color: 'white', border: 'none', borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '700', fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Secure Login")}
          </button>
        </form>

        {/* --- THE TOGGLE BUTTON --- */}
        <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ 
                background: 'none', border: 'none', color: '#0f766e', 
                fontWeight: '700', cursor: 'pointer', marginLeft: '5px',
                textDecoration: 'underline'
              }}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;