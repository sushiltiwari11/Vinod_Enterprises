import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

function Cart() {
  const navigate = useNavigate();
  // Bring in all the tools from your context
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please log in or create an account to securely place your order!");
      navigate('/login');
      return; 
    }
    navigate('/checkout'); 
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '70vh', fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ color: '#0f172a', borderBottom: '2px solid #0d9488', paddingBottom: '10px' }}>
        Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🛒</div>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Your cart is currently empty.</p>
          <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 25px', backgroundColor: '#0d9488', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            Browse the Catalog
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cart.map((item) => {
              const qty = item.qty || 1;
              return (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '15px' }}>
                  
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem', display: 'block' }}>{item.name}</span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>₹{item.price} each</span>
                  </div>

                  {/* Quantity Controls inside the Cart! */}
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                    <button 
                      onClick={() => qty === 1 ? removeFromCart(item.id) : updateQuantity(item.id, qty - 1)}
                      style={{ backgroundColor: 'transparent', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
                    >-</button>
                    <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, qty + 1)}
                      style={{ backgroundColor: 'transparent', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
                    >+</button>
                  </div>

                  <div style={{ width: '100px', textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '1.2rem' }}>₹{item.price * qty}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Total Amount:</h3>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem', fontWeight: '900' }}>₹{getCartTotal()}</h3>
          </div>

          <button onClick={handleCheckout}
            style={{ width: '100%', padding: '15px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer' }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;