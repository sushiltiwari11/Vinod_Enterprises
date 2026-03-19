import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // NEW: State to hold the specific PIN code error message
  const [pinError, setPinError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: 'Delhi', pincode: '', paymentMethod: 'COD'
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const ALLOWED_CITIES = ["Delhi", "New Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // NEW: If they start typing in the pincode box again, clear the old error
    if (e.target.name === 'pincode') {
      setPinError('');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // 1. PIN Code Validation for NCR
    const pinPrefix = formData.pincode.substring(0, 2);
    if (!['11', '12', '20'].includes(pinPrefix) || formData.pincode.length !== 6) {
      // INSTEAD of alert(), we set the error state here
      setPinError("Sorry! We currently only deliver to Delhi NCR PIN codes.");
      return; // Stop the function here so the order doesn't process
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      alert("Please log in to place an order.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: session.user.id, 
        customer_email: session.user.email,
        shipping_details: formData, 
        items: cart, 
        total_amount: totalPrice,
        status: formData.paymentMethod === 'UPI' ? 'Awaiting Payment Verification' : 'Processing', 
        order_date: new Date().toLocaleDateString()
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;

      if (formData.paymentMethod === 'UPI') {
        alert(`Order Placed! Please pay ₹${totalPrice} to our UPI number: 9876543210@upi. We will process the order once payment is verified.`);
      } else {
        alert(`Success! Your Magic products are on the way to ${formData.city}. You can pay on delivery.`);
      }
      
      clearCart(); 
      navigate('/profile'); 
      
    } catch (error) {
      console.error("Error saving order: ", error);
      alert("There was an issue processing your order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate('/products')} style={{ padding: '10px 20px', backgroundColor: '#0f766e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Go to Products
        </button>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '14px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '70vh', display: 'flex', gap: '40px', flexWrap: 'wrap', fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ flex: '1 1 550px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#0f172a', borderBottom: '2px solid #0f766e', paddingBottom: '15px', marginBottom: '25px', fontSize: '1.8rem' }}>
          Delivery Details
        </h2>
        
        <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '15px', borderRadius: '8px', marginBottom: '25px', fontSize: '0.95rem', borderLeft: '4px solid #0284c7' }}>
          <strong>📍 Notice:</strong> We currently only deliver to Delhi, Noida, Gurugram, Faridabad, and Ghaziabad.
        </div>

        <form onSubmit={handlePlaceOrder}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" name="name" required style={inputStyle} onChange={handleInputChange} placeholder="E.g. Vinod Kumar" />
          
          <label style={labelStyle}>Phone Number</label>
          <input type="tel" name="phone" required style={inputStyle} onChange={handleInputChange} placeholder="10-digit mobile number" pattern="[0-9]{10}" title="Please enter exactly 10 digits" />
          
          <label style={labelStyle}>Full Address (House, Street, Area)</label>
          <textarea name="address" required style={{...inputStyle, minHeight: '100px'}} onChange={handleInputChange} placeholder="Enter your full street address..."></textarea>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City (NCR Only)</label>
              <select name="city" required style={inputStyle} onChange={handleInputChange} value={formData.city}>
                {ALLOWED_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>PIN Code</label>
              {/* If there is a pinError, we turn the border red. Otherwise, keep it normal. */}
              <input 
                type="text" 
                name="pincode" 
                required 
                style={{ ...inputStyle, borderColor: pinError ? '#ef4444' : '#cbd5e1', marginBottom: pinError ? '5px' : '15px' }} 
                onChange={handleInputChange} 
                placeholder="E.g. 110001" 
                maxLength="6" 
              />
              {/* This is the inline error message that shows up just below the input box */}
              {pinError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '15px' }}>
                  {pinError}
                </div>
              )}
            </div>
          </div>

          <h3 style={{ color: '#0f172a', marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Payment Method</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: formData.paymentMethod === 'COD' ? '2px solid #0f766e' : '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.paymentMethod === 'COD' ? '#f0fdfa' : 'white' }}>
              <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Cash on Delivery (COD)</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Pay when your package arrives.</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: formData.paymentMethod === 'UPI' ? '2px solid #0f766e' : '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.paymentMethod === 'UPI' ? '#f0fdfa' : 'white' }}>
              <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleInputChange} style={{ width: '20px', height: '20px' }} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Pay via UPI (GPay / PhonePe)</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Send payment manually after placing the order.</span>
              </div>
            </label>
          </div>

          <button disabled={isProcessing} type="submit" style={{ width: '100%', padding: '18px', backgroundColor: isProcessing ? '#94a3b8' : '#0f766e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: '800', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            {isProcessing ? 'Processing...' : `Confirm Order (₹${totalPrice})`}
          </button>
        </form>
      </div>

      <div style={{ flex: '1 1 350px', backgroundColor: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '1.5rem', marginBottom: '20px' }}>Order Summary</h3>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#475569', fontSize: '0.95rem' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{item.name}</span>
              <span style={{ fontWeight: 'bold' }}>₹{item.price}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '900', color: '#0f766e' }}>
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

    </div>
  );
}

export default Checkout;