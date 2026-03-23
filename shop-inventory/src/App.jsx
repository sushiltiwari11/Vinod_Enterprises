import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { CartProvider } from './context/CartContext'; 
import ProtectedRoute from './components/ProtectedRoute'; // <-- THE NEW BOUNCER

import Navbar from './components/Navbar';
import Footer from './components/footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Admin from './pages/admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import About from './pages/About';
import Addresses from './pages/Addresses';
import Payments from './pages/Payments';

const PlaceholderPage = ({ title, icon }) => (
  <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ fontSize: '4rem', marginBottom: '20px' }}>{icon}</span>
    <h1 style={{ color: '#0f172a', fontSize: '2.5rem', marginBottom: '10px' }}>{title}</h1>
    <p style={{ color: '#64748b', fontSize: '1.2rem' }}>This page is currently under construction. Check back soon!</p>
  </div>
);

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          
          <Toaster position="bottom-right" reverseOrder={false} />
          <Navbar /> 
          
          <div style={{ flex: 1 }}>
            <Routes>
              {/* --- PUBLIC ROUTES (Anyone can visit) --- */}
              <Route path="/" element={<Home />} /> 
              <Route path="/products" element={<Products />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/collection" element={<PlaceholderPage title="The Magic Collection" icon="✨" />} />

              {/* --- PRIVATE USER ROUTES (Must be logged in to see these) --- */}
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> 
              <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              
              {/* --- STRICT ADMIN ROUTE (Only YOU can see this) --- */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
            </Routes>
          </div>

          <Footer />

        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;