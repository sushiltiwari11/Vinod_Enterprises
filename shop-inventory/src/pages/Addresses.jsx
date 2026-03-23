import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // Updated state to perfectly match your database columns
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase.from('saved_addresses').select('*').eq('user_id', session.user.id);
    if (data) setAddresses(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('saved_addresses').insert([{ ...formData, user_id: session.user.id }]);
    
    if (error) {
      toast.error("Failed to save address.");
    } else {
      toast.success("Address saved successfully!");
      setShowForm(false);
      setFormData({ name: '', phone: '', address: '', city: '', pincode: '' });
      fetchAddresses();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('saved_addresses').delete().eq('id', id);
    toast.success("Address removed.");
    fetchAddresses();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading addresses...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '20px' }}>Saved Addresses 📍</h1>
      
      {addresses.map(addr => (
        <div key={addr.id} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', marginBottom: '15px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{addr.name} <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'normal' }}>({addr.phone})</span></h3>
            <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>
              {addr.address}<br/>
              {addr.city} {addr.pincode}
            </p>
          </div>
          <button onClick={() => handleDelete(addr.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
        </div>
      ))}

      {addresses.length === 0 && !showForm && <p style={{ color: '#64748b' }}>You have no saved addresses yet.</p>}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{ background: '#0d9488', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}>+ Add New Address</button>
      ) : (
        <form onSubmit={handleSave} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0 }}>New Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ gridColumn: '1 / -1', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required placeholder="Pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <button type="submit" style={{ background: '#0d9488', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>Save Address</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#64748b', padding: '10px 20px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default Addresses;