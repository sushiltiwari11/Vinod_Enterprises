import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CartContext } from '../context/CartContext'; // Hooks up to your global memory

function Cart() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  // This mathematical wizardry calculates the total price of all items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '70vh' }}>
      <h2 style={{ color: '#008080', borderBottom: '2px solid #059669', paddingBottom: '10px' }}>
        Your Shopping Cart
      </h2>

      {/* If the cart is empty, show a friendly message */}
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🛒</div>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is currently empty.</p>
          <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 25px', backgroundColor: '#008080', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' }}>
            Browse the Catalog
          </Link>
        </div>
      ) : (
        /* If there are items, display the receipt and total */
        <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cart.map((item, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '50%' }}>{item.icon}</span>
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: '#059669', fontSize: '1.1rem' }}>₹{item.price}</span>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, color: '#333' }}>Total Amount:</h3>
            <h3 style={{ margin: 0, color: '#008080', fontSize: '1.8rem' }}>₹{totalPrice}</h3>
          </div>

          <button onClick={() => navigate('/checkout')}
            style={{ width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;