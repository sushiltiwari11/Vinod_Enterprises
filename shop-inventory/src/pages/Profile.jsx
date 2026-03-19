import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // 🟢 Switched to Supabase
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [realOrders, setRealOrders] = useState([]); 
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      // 🟢 Supabase check for logged in user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchMyOrders(session.user.id); 
      } else {
        navigate('/login');
      }
    };
    fetchUserAndOrders();
  }, [navigate]);

  const fetchMyOrders = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });
        
      if (!error && data) {
        setRealOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAuth");
    navigate('/login');
  };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  const menuStyle = (tabName) => ({ padding: '15px 20px', cursor: 'pointer', borderBottom: activeTab === tabName ? '3px solid #008080' : '1px solid #e5e7eb', color: activeTab === tabName ? '#008080' : '#4b5563', fontWeight: activeTab === tabName ? 'bold' : 'normal', backgroundColor: activeTab === tabName ? '#f0fdfa' : 'transparent' });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '70vh', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      <div style={{ flex: '1 1 250px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', height: 'fit-content', overflow: 'hidden' }}>
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#003333', color: 'white' }}>
          <div style={{ width: '70px', height: '70px', backgroundColor: '#059669', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#d1d5db' }}>{user.email}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={menuStyle('orders')} onClick={() => setActiveTab('orders')}>📦 My Orders</div>
          <div style={menuStyle('settings')} onClick={() => setActiveTab('settings')}>⚙️ Account Settings</div>
          
          {user.email === 'vinodenterprisesmagic@gmail.com' && (
            <div style={{ padding: '15px 20px', cursor: 'pointer', color: '#008080', fontWeight: 'bold', borderTop: '1px solid #e5e7eb', backgroundColor: '#f0fdfa' }} onClick={() => navigate('/admin')}>
              🛠️ Admin Panel
            </div>
          )}

          <div style={{ padding: '15px 20px', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold', borderTop: '1px solid #e5e7eb' }} onClick={handleLogout}>🚪 Sign Out</div>
        </div>
      </div>

      <div style={{ flex: '1 1 500px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ color: '#008080', borderBottom: '2px solid #059669', paddingBottom: '10px', marginTop: 0 }}>Order History</h2>
            
            {isLoadingOrders ? (
              <p>Loading your orders...</p>
            ) : realOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>You haven't placed any orders yet!</p>
                <button onClick={() => navigate('/products')} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Start Shopping</button>
              </div>
            ) : (
              realOrders.map(order => (
                <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Order ID: #{order.id}</span>
                    <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{order.status}</span>
                  </div>
                  <p style={{ margin: '5px 0', color: '#4b5563' }}><strong>Date:</strong> {order.order_date}</p>
                  <p style={{ margin: '5px 0', color: '#4b5563' }}><strong>Items:</strong> {order.items?.map(i => i.name).join(', ')}</p>
                  <p style={{ margin: '10px 0 0 0', color: '#008080', fontWeight: 'bold', fontSize: '1.2rem' }}>Total: ₹{order.total_amount}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ color: '#008080', borderBottom: '2px solid #059669', paddingBottom: '10px', marginTop: 0 }}>Account Settings</h2>
            <div style={{ padding: '15px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;