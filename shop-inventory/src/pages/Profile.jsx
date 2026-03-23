import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import Invoice from '../components/invoice';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  useEffect(() => {
    fetchUserDataAndOrders();
  }, []);

  const fetchUserDataAndOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUser(session.user);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; 
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#0f172a' }}>Loading your profile...</div>;
  }

  // --- VIEW 1: THE INVOICE VIEW ---
  if (selectedOrderForInvoice) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>
          <button 
            onClick={() => setSelectedOrderForInvoice(null)}
            style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ← Back to Order History
          </button>
        </div>
        
        <Invoice order={selectedOrderForInvoice} />
      </div>
    );
  }

  // --- VIEW 2: THE NORMAL PROFILE VIEW ---
  return (
    <div className="no-print" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Profile Header */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', color: '#0f172a' }}>My Profile 👤</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>{user?.email}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Order History Section */}
      <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        Order History 📦
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '3rem' }}>🛒</span>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '10px' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              
              <div>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>
                    Order ID: {order.order_id || `#${order.id}`}
                  </p>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>
                  {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items
                </p>
                <span style={{ 
                  display: 'inline-block', padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold',
                  backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef08a',
                  color: order.status === 'Delivered' ? '#16a34a' : '#a16207'
                }}>
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>₹{order.total_amount}</span>
                
                {/* SMART INVOICE LOGIC: Only show button if status is Delivered */}
                {order.status === 'Delivered' ? (
                  <button 
                    onClick={() => setSelectedOrderForInvoice(order)}
                    style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    📄 Invoice
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                    ⏳ Invoice generated on delivery
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Profile;