import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase.from('saved_payments').select('*').eq('user_id', session.user.id);
    if (data) setPayments(data);
    setLoading(false);
  };

  const handleSaveUPI = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Updated to match your 'type' and 'details' columns
    const { error } = await supabase.from('saved_payments').insert([
      { user_id: session.user.id, type: 'UPI', details: upiId }
    ]);
    
    if (error) {
      toast.error("Failed to save UPI ID.");
    } else {
      toast.success("UPI ID saved successfully!");
      setUpiId('');
      fetchPayments();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('saved_payments').delete().eq('id', id);
    toast.success("Payment method removed.");
    fetchPayments();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '20px' }}>Payment Methods 💳</h1>
      
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '15px', borderRadius: '8px', marginBottom: '30px', fontSize: '0.9rem' }}>
        <strong>Security Notice:</strong> For your protection, Vinod Enterprises does not store credit card numbers on our servers. All card transactions are processed securely via our encrypted payment gateway during checkout. You may save your preferred UPI IDs below for faster checkout.
      </div>

      <h3 style={{ color: '#0f172a' }}>Saved UPI IDs</h3>
      {payments.filter(p => p.type === 'UPI').map(payment => (
        <div key={payment.id} style={{ border: '1px solid #e2e8f0', padding: '15px 20px', borderRadius: '12px', marginBottom: '15px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '1.5rem' }}>📱</span>
            <span style={{ fontWeight: 'bold', color: '#334155' }}>{payment.details}</span>
          </div>
          <button onClick={() => handleDelete(payment.id)} style={{ background: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
        </div>
      ))}

      {payments.length === 0 && <p style={{ color: '#64748b' }}>No saved payment methods.</p>}

      <form onSubmit={handleSaveUPI} style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <input 
          required 
          type="text" 
          placeholder="Enter UPI ID (e.g., name@bank)" 
          value={upiId} 
          onChange={e => setUpiId(e.target.value)} 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
        />
        <button type="submit" style={{ background: '#ea580c', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save UPI
        </button>
      </form>
    </div>
  );
}

export default Payments;