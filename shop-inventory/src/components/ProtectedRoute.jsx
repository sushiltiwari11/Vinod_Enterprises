import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Your master admin key
  const ADMIN_EMAIL = 'vinodenterprisesmagic@gmail.com';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', color: '#0f766e', fontWeight: 'bold' }}>
        <span>🔒 Verifying Security Clearance...</span>
      </div>
    );
  }

  // 1. If they are not logged in at all, kick them to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this page requires Admin rights, and they aren't you, kick them to Home
  if (requireAdmin && user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  // 3. If they pass the checks, let them see the page!
  return children;
};

export default ProtectedRoute;