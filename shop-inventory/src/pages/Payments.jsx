import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Payments() {
  const [user, setUser] = useState(null);
  const [savedMethods, setSavedMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ type: 'UPI', details: '' });

  const fetchPayments = async (userId) => {
    const { data } = await supabase.from('saved_payments').select('*').eq('user_id', userId).order('id', { ascending: false });
    if (data) setSavedMethods(data);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchPayments(session.user.id);
      } else {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('saved_payments').insert([{ ...formData, user_id: user.id }]);
      if (error) throw error;
      
      alert(`${formData.type} saved successfully!`);
      setShowForm(false);
      setFormData({ type: 'UPI', details: '' });
      fetchPayments(user.id);
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this payment method?")) {
      await supabase.from('saved_payments').delete().eq('id', id);
      fetchPayments(user.id);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '6px' };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', minHeight: '70vh', fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f766e', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#0f172a', margin: 0 }}>💳 Payment Methods</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? "Cancel" : "+ Add UPI / Wallet"}
        </button>
      </div>

      {/* --- ADD PAYMENT FORM --- */}
      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', borderTop: '4px solid #0f766e' }}>
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>Save a New Method</h2>
          <form onSubmit={handleSavePayment}>
            <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle}>
              <option value="UPI">UPI ID (GPay, PhonePe, Paytm)</option>
              <option value="Wallet">Mobile Wallet Number</option>
            </select>
            <input 
              type="text" 
              placeholder={formData.type === 'UPI' ? "E.g. name@okhdfcbank" : "10-digit Mobile Number"} 
              required 
              value={formData.details} 
              onChange={(e) => setFormData({...formData, details: e.target.value})} 
              style={inputStyle} 
            />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save {formData.type}</button>
          </form>
        </div>
      )}

      {/* --- SAVED METHODS (UPI & WALLET) --- */}
      <h3 style={{ color: '#475569', marginBottom: '15px' }}>Saved UPI & Wallets</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {savedMethods.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No UPI IDs or Wallets saved.</p>
        ) : (
          savedMethods.map(method => (
            <div key={method.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{method.type === 'UPI' ? '📱' : '👛'}</span>
                <strong style={{ color: '#0f172a' }}>{method.type}</strong>
                <div style={{ color: '#475569', fontSize: '0.9rem', marginTop: '5px' }}>{method.details}</div>
              </div>
              <button onClick={() => handleDelete(method.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
            </div>
          ))
        )}
      </div>

      {/* --- SAVED CARDS (RAZORPAY PREP) --- */}
      <h3 style={{ color: '#475569', marginBottom: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>Saved Cards (Credit/Debit)</h3>
      <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🔒</span>
        <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Secure Card Saving Coming Soon</h4>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
          To ensure maximum PCI-DSS compliance and security, card saving will be activated alongside our Razorpay integration. Your financial data safety is our top priority.
        </p>
      </div>

    </div>
  );
}

export default Payments;