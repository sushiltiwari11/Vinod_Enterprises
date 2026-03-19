import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Addresses() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: 'Delhi', pincode: '' });
  const ALLOWED_CITIES = ["Delhi", "New Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad"];

  const fetchAddresses = async (userId) => {
    const { data, error } = await supabase.from('saved_addresses').select('*').eq('user_id', userId).order('id', { ascending: false });
    if (data) setAddresses(data);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchAddresses(session.user.id);
      } else {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('saved_addresses').insert([{ ...formData, user_id: user.id }]);
      if (error) throw error;
      
      alert("Address saved successfully!");
      setShowForm(false);
      setFormData({ name: '', phone: '', address: '', city: 'Delhi', pincode: '' });
      fetchAddresses(user.id);
    } catch (error) {
      alert("Error saving address: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this address?")) {
      await supabase.from('saved_addresses').delete().eq('id', id);
      fetchAddresses(user.id);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #cbd5e1', borderRadius: '6px' };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', minHeight: '70vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f766e', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#0f172a', margin: 0 }}>📍 My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#0f766e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {/* --- ADD ADDRESS FORM --- */}
      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', borderTop: '4px solid #0f766e' }}>
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>Add a Delivery Location</h2>
          <form onSubmit={handleSaveAddress}>
            <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
            <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
            <textarea placeholder="Full Address (House, Street)" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{...inputStyle, flex: 1}}>
                {ALLOWED_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="PIN Code" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} style={{...inputStyle, flex: 1}} maxLength="6" />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save Address</button>
          </form>
        </div>
      )}

      {/* --- SAVED ADDRESSES GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {addresses.length === 0 && !showForm ? (
          <p style={{ color: '#64748b' }}>No addresses saved yet.</p>
        ) : (
          addresses.map(add => (
            <div key={add.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{add.name}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#475569', fontSize: '0.9rem' }}>📞 {add.phone}</p>
              <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '0.9rem', lineHeight: '1.4' }}>{add.address}<br/>{add.city} - {add.pincode}</p>
              <button onClick={() => handleDelete(add.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Addresses;