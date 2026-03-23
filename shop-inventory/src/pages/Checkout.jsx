import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('COD'); 
  
  // Payment States
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  
  const [adminUpi, setAdminUpi] = useState({ id: 'Loading...', qr: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [activeAddressId, setActiveAddressId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address1: '', address2: '', city: '', state: '', pincode: ''
  });

  const totalItemsCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  useEffect(() => {
    fetchSavedAddresses();
    fetchAdminSettings();
  }, []);

  const fetchSavedAddresses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('saved_addresses').select('*').eq('user_id', session.user.id);
    if (data) setSavedAddresses(data);
  };

  const fetchAdminSettings = async () => {
    const { data } = await supabase.from('store_settings').select('*');
    if (data) {
      const upiId = data.find(s => s.setting_key === 'upi_id')?.setting_value || '';
      const upiQr = data.find(s => s.setting_key === 'upi_qr_url')?.setting_value || '';
      setAdminUpi({ id: upiId, qr: upiQr });
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectSavedAddress = (addr) => {
    setActiveAddressId(addr.id); setSaveNewAddress(false); 
    const nameParts = addr.name ? addr.name.split(' ') : [''];
    setFormData({ firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', phone: addr.phone || '', address1: addr.address || '', address2: '', city: addr.city || '', state: '', pincode: addr.pincode || '' });
    toast.success("Address applied!", { icon: '📍' });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty!");
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NEW: Handle the Screenshot Upload securely
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingScreenshot(true);
    
    // Create a unique file name
    const fileName = `proof_${Date.now()}.${file.name.split('.').pop()}`;
    
    try {
      // Reusing your product-images bucket since it's already configured correctly!
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setPaymentScreenshot(urlData.publicUrl);
      toast.success("Screenshot uploaded securely!");
    } catch (err) {
      toast.error("Error uploading screenshot.");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleFinalCheckout = async () => {
    // ENFORCED RULE: Screenshot is mandatory, Transaction ID is optional!
    if (paymentMode === 'UPI' && !paymentScreenshot) {
      return toast.error("Please upload the payment screenshot before placing the order.");
    }
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return toast.error("Session expired. Please log in."); }

      const combinedName = `${formData.firstName} ${formData.lastName}`.trim();
      const combinedAddress = `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}\n${formData.city}, ${formData.state} - ${formData.pincode}`;
      const uniqueOrderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

      const orderPayload = {
        order_id: uniqueOrderId,
        user_id: session.user.id,
        customer_name: combinedName,
        customer_phone: formData.phone,
        shipping_address: combinedAddress,
        items: cart, 
        total_amount: getCartTotal(),
        payment_method: paymentMode,
        transaction_id: paymentMode === 'UPI' ? transactionId : null,
        payment_screenshot_url: paymentMode === 'UPI' ? paymentScreenshot : null // Save the screenshot!
      };

      const { error: orderError } = await supabase.from('orders').insert([orderPayload]);
      if (orderError) throw orderError;

      if (saveNewAddress) {
        await supabase.from('saved_addresses').insert([{
          user_id: session.user.id, name: combinedName, phone: formData.phone,
          address: `${formData.address1} ${formData.address2}`.trim(), city: formData.city, pincode: formData.pincode
        }]);
      }

      clearCart();
      toast.success("Order placed successfully!");
      navigate('/profile');

    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.95rem', fontFamily: "'Inter', sans-serif" };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#334155', fontSize: '0.9rem' };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .checkout-layout { display: flex; gap: 40px; max-width: 1200px; margin: 0 auto; align-items: flex-start; }
        .checkout-form { flex: 1.5; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; }
        .checkout-summary { flex: 1; background: #f1f5f9; padding: 30px; border-radius: 12px; position: sticky; top: 100px; border: 1px solid #e2e8f0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .saved-address-card { border: 2px solid #e2e8f0; padding: 15px; borderRadius: 8px; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
        .saved-address-card.active { borderColor: #0d9488; background: #f0fdfa; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15); }
        .pay-card { border: 2px solid #cbd5e1; padding: 20px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s; }
        .pay-card.selected { border-color: #ea580c; background-color: #fff7ed; }
        @media (max-width: 900px) { .checkout-layout { flex-direction: column-reverse; } .checkout-summary { position: static; } .grid-2 { grid-template-columns: 1fr; gap: 15px; } .checkout-form { padding: 20px; } }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto 30px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
         <div style={{ color: step >= 1 ? '#0d9488' : '#94a3b8', fontWeight: 'bold', fontSize: '1.2rem' }}>1. Shipping Details</div>
         <div style={{ height: '3px', width: '50px', backgroundColor: step === 2 ? '#0d9488' : '#cbd5e1' }}></div>
         <div style={{ color: step === 2 ? '#0d9488' : '#94a3b8', fontWeight: 'bold', fontSize: '1.2rem' }}>2. Secure Payment</div>
      </div>

      <div className="checkout-layout">
        
        <div className="checkout-form">
          {step === 1 ? (
            // ================= STEP 1: ADDRESS FORM ================= //
            <>
              <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 10px 0' }}>Shipping Information</h2>
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '30px', paddingBottom: '30px', borderBottom: '2px solid #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '15px' }}>Quick Fill: Choose a saved address</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {savedAddresses.map(addr => (
                      <div key={addr.id} className={`saved-address-card ${activeAddressId === addr.id ? 'active' : ''}`} onClick={() => handleSelectSavedAddress(addr)}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#0f172a' }}>{addr.name}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>{addr.address}<br/>{addr.city}, {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-2">
                  <div><label style={labelStyle}>First Name</label><input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Last Name</label><input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={inputStyle} /></div>
                </div>
                <div><label style={labelStyle}>Phone Number</label><input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Address Line 1</label><input required type="text" name="address1" value={formData.address1} onChange={handleInputChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Address Line 2</label><input type="text" name="address2" value={formData.address2} onChange={handleInputChange} style={inputStyle} /></div>
                <div className="grid-2">
                  <div><label style={labelStyle}>City</label><input required type="text" name="city" value={formData.city} onChange={handleInputChange} style={inputStyle} /></div>
                  <div><label style={labelStyle}>State</label>
                    <select required name="state" value={formData.state} onChange={handleInputChange} style={{...inputStyle, backgroundColor: 'white'}}>
                      <option value="">Select State</option><option value="Delhi">Delhi</option><option value="Haryana">Haryana</option><option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                </div>
                <div><label style={labelStyle}>Pincode</label><input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} style={inputStyle} /></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '15px', backgroundColor: '#f0fdfa', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                  <input type="checkbox" id="saveAddress" checked={saveNewAddress} onChange={(e) => { setSaveNewAddress(e.target.checked); if(e.target.checked) setActiveAddressId(null); }} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="saveAddress" style={{ cursor: 'pointer', color: '#0f766e', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>Save this address for future orders</label>
                </div>

                <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', padding: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '1.2rem', marginTop: '10px' }}>
                  Continue to Payment →
                </button>
              </form>
            </>
          ) : (
            // ================= STEP 2: PAYMENT SECTION ================= //
            <div>
               <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', padding: 0 }}>← Back to Shipping</button>
               <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 20px 0' }}>Select Payment Method</h2>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                  <div className={`pay-card ${paymentMode === 'UPI' ? 'selected' : ''}`} onClick={() => setPaymentMode('UPI')}>
                    <span style={{ fontSize: '2rem' }}>📱</span>
                    <div><h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Pay via UPI</h3><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Scan QR or pay to UPI ID</p></div>
                  </div>

                  <div className={`pay-card ${paymentMode === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMode('COD')}>
                    <span style={{ fontSize: '2rem' }}>💵</span>
                    <div><h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Cash on Delivery</h3><p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Pay when the product arrives</p></div>
                  </div>
               </div>

               {paymentMode === 'UPI' && (
                 <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Scan to Pay ₹{getCartTotal()}</h3>
                    
                    {adminUpi.qr ? (
                      <img src={adminUpi.qr} alt="UPI QR" style={{ width: '200px', height: '200px', objectFit: 'contain', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '10px', backgroundColor: 'white' }} />
                    ) : (
                      <div style={{ width: '200px', height: '200px', backgroundColor: '#e2e8f0', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: '#64748b' }}>No QR Uploaded</div>
                    )}
                    
                    <p style={{ margin: '15px 0', fontSize: '1.1rem', color: '#334155' }}><strong>UPI ID:</strong> {adminUpi.id}</p>
                    
                    <div style={{ textAlign: 'left', marginTop: '20px' }}>
                      <label style={labelStyle}>Enter Transaction ID / UTR Number <span style={{color: '#94a3b8'}}>(Optional)</span></label>
                      <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. 301234567890" style={inputStyle} />
                    </div>

                    {/* NEW COMPULSORY SCREENSHOT UPLOAD */}
                    <div style={{ textAlign: 'left', marginTop: '20px' }}>
                      <label style={labelStyle}>Upload Payment Screenshot <span style={{color: '#dc2626'}}>* Required</span></label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <input type="file" accept="image/*" onChange={handleScreenshotUpload} style={{ fontSize: '0.9rem' }} />
                        {uploadingScreenshot && <span style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '0.9rem' }}>Uploading...</span>}
                        {paymentScreenshot && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>✓ File Attached</span>}
                      </div>
                    </div>
                 </div>
               )}

               <button onClick={handleFinalCheckout} disabled={loading || uploadingScreenshot} style={{ backgroundColor: loading || uploadingScreenshot ? '#94a3b8' : '#ea580c', color: 'white', padding: '18px', border: 'none', borderRadius: '8px', cursor: loading || uploadingScreenshot ? 'not-allowed' : 'pointer', fontWeight: '800', fontSize: '1.2rem', width: '100%', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)' }}>
                  {loading ? 'Processing...' : paymentMode === 'COD' ? `Place Order (COD)` : `Verify Payment & Place Order`}
               </button>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 20px 0' }}>Order Summary</h2>
          <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', position: 'relative' }}><span style={{ fontSize: '1.5rem' }}>🧴</span><span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#64748b', color: 'white', fontSize: '0.7rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>{item.qty || 1}</span></div>
                  <div><h4 style={{ margin: '0 0 4px 0', color: '#334155', fontSize: '0.95rem' }}>{item.name}</h4><span style={{ color: '#64748b', fontSize: '0.85rem' }}>{item.category}</span></div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>₹{(item.price * (item.qty || 1))}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '2px solid #cbd5e1', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}><span>Subtotal ({totalItemsCount} items)</span><span>₹{getCartTotal()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}><span>Shipping</span><span style={{ color: '#16a34a', fontWeight: 'bold' }}>FREE</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #cbd5e1', fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}><span>Total</span><span>₹{getCartTotal()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;