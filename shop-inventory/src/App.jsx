import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// THE FIX: This prevents the white screen!
import { CartProvider } from './context/CartContext'; 

import About from './pages/About';
import Addresses from './pages/Addresses';
import Payments from './pages/Payments';

import Navbar from './components/Navbar';
import Footer from './components/footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Admin from './pages/admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

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
          
          <Navbar /> 
          
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/products" element={<Products />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Profile />} /> 
              <Route path="/about" element={<About />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/payments" element={<Payments />} />
              
              <Route path="/about" element={<PlaceholderPage title="About Vinod Enterprises" icon="🏢" />} />
              <Route path="/collection" element={<PlaceholderPage title="The Magic Collection" icon="✨" />} />
              <Route path="/addresses" element={<PlaceholderPage title="Saved Addresses" icon="📍" />} />
              <Route path="/payments" element={<PlaceholderPage title="Payment Methods" icon="💳" />} />
            </Routes>
          </div>

          <Footer />

        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;