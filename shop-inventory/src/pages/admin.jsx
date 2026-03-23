import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import toast from 'react-hot-toast';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const [product, setProduct] = useState({ name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' });

  // NEW: Store Settings State
  const [storeSettings, setStoreSettings] = useState({ upi_id: '', upi_qr_url: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const categories = ["Floor Care", "Surface Care", "Heavy Duty", "Hygiene", "Restroom", "Kitchen Care"];

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (prodData) setProducts(prodData);

    const { data: ordData } = await supabase.from('orders').select('*').order('id', { ascending: false });
    if (ordData) {
      setOrders(ordData);
      const sales = ordData.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      setStats({ totalSales: sales, totalOrders: ordData.length, totalProducts: prodData ? prodData.length : 0 });
    }

    // Fetch Store Settings
    const { data: settingsData } = await supabase.from('store_settings').select('*');
    if (settingsData) {
      const upiId = settingsData.find(s => s.setting_key === 'upi_id')?.setting_value || '';
      const upiQr = settingsData.find(s => s.setting_key === 'upi_qr_url')?.setting_value || '';
      setStoreSettings({ upi_id: upiId, upi_qr_url: upiQr });
    }

    setLoading(false);
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const { data, error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId).select();
    if (error) { toast.error(`Database Error: ${error.message}`); } 
    else if (data && data.length === 0) { toast.error("Security Block: Database refused to update."); } 
    else { toast.success(`Order updated to ${newStatus}!`); fetchDashboardData(); }
  };

  const handleImageUpload = async (e, isQrCode = false) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    
    try {
      await supabase.storage.from('product-images').upload(fileName, file);
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      if (isQrCode) {
        setStoreSettings({ ...storeSettings, upi_qr_url: urlData.publicUrl });
        toast.success("QR Code uploaded successfully!");
      } else {
        setProduct({ ...product, image_url: urlData.publicUrl });
      }
    } catch (error) { toast.error("Error uploading image"); } 
    finally { setUploading(false); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await supabase.from('store_settings').upsert([
        { setting_key: 'upi_id', setting_value: storeSettings.upi_id },
        { setting_key: 'upi_qr_url', setting_value: storeSettings.upi_qr_url }
      ]);
      toast.success("Payment settings updated successfully!");
    } catch (err) { toast.error("Failed to save settings."); }
    setSavingSettings(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...product, price: Number(product.price), quantity: Number(product.quantity) };
    try {
      if (isEditing) { await supabase.from('products').update(productData).eq('id', currentProductId); toast.success("Product Updated!"); } 
      else { await supabase.from('products').insert([productData]); toast.success("Product Added!"); }
      setProduct({ name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' });
      setIsEditing(false); setCurrentProductId(null); fetchDashboardData(); 
    } catch (error) { toast.error("Error saving product: " + error.message); }
  };

  const startEdit = (p) => { setIsEditing(true); setCurrentProductId(p.id); setProduct(p); setActiveTab('inventory'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = async (id) => { if(window.confirm("Delete this product permanently?")) { await supabase.from('products').delete().eq('id', id); fetchDashboardData(); } };
  const toggleStock = async (id, currentStatus) => { const newStatus = currentStatus === 'In Stock' ? 'Stock Out' : 'In Stock'; await supabase.from('products').update({ status: newStatus }).eq('id', id); fetchDashboardData(); };

  const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: '1 1 200px', fontSize: '1rem' };
  const tabStyle = (isActive) => ({ padding: '12px 20px', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: isActive ? '#0f766e' : '#e2e8f0', color: isActive ? 'white' : '#475569' });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.5rem', color: '#0f766e' }}>Loading Command Center... ⚙️</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ color: '#0f172a', margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button style={tabStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Orders</button>
          <button style={tabStyle(activeTab === 'inventory')} onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
          <button style={tabStyle(activeTab === 'settings')} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #0d9488' }}><h3 style={{ color: '#64748b', margin: '0 0 10px 0', fontSize: '1rem' }}>Total Revenue</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>₹{stats.totalSales}</p></div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #ea580c' }}><h3 style={{ color: '#64748b', margin: '0 0 10px 0', fontSize: '1rem' }}>Total Orders</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>{stats.totalOrders}</p></div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #2563eb' }}><h3 style={{ color: '#64748b', margin: '0 0 10px 0', fontSize: '1rem' }}>Active Products</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>{stats.totalProducts}</p></div>
          </div>

          <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Recent Orders</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Order Info</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Customer Details</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Payment Info</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px' }}><strong>{order.order_id || `#${order.id}`}</strong><br/><small>{new Date(order.created_at).toLocaleDateString()}</small><br/><strong style={{ color: '#0d9488' }}>₹{order.total_amount}</strong></td>
                    <td style={{ padding: '15px' }}>{order.customer_name}<br/><small>📞 {order.customer_phone}</small><br/><small style={{color: '#64748b'}}>{order.shipping_address}</small></td>
                    
                    {/* UPDATED: Payment Info Cell with Screenshot Link */}
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: order.payment_method === 'UPI' ? '#dbeafe' : '#f3f4f6', color: order.payment_method === 'UPI' ? '#1e40af' : '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {order.payment_method || 'COD'}
                      </span>
                      {order.transaction_id && <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#64748b' }}>Txn: {order.transaction_id}</div>}
                      
                      {/* MAGIC: The Screenshot Button! */}
                      {order.payment_screenshot_url && (
                        <a href={order.payment_screenshot_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.8rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #10b981' }}>
                          📸 View Proof
                        </a>
                      )}
                    </td>

                    <td style={{ padding: '15px' }}>
                      <select value={order.status} onChange={(e) => handleOrderStatusChange(order.id, e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '600px' }}>
          <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #ea580c' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>💳 Payment Gateway Settings</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Update your UPI ID and Barcode here. This is exactly what customers will see at checkout.</p>
            
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>Official UPI ID</label>
                <input required placeholder="e.g., vinodenterprises@okhdfc" value={storeSettings.upi_id} onChange={(e) => setStoreSettings({...storeSettings, upi_id: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>UPI Barcode Image (QR Code)</label>
                {storeSettings.upi_qr_url && (
                  <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'inline-block' }}>
                    <img src={storeSettings.upi_qr_url} alt="Current QR" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} style={{ fontSize: '0.9rem' }} />
                  {uploading && <span style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '0.9rem' }}>Uploading...</span>}
                </div>
              </div>

              <button type="submit" disabled={savingSettings || uploading} style={{ backgroundColor: '#0f172a', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
                {savingSettings ? "Saving..." : "Save Payment Settings"}
              </button>
            </form>
          </section>
        </div>
      )}

      {/* Inventory Tab logic kept identical... */}
      {activeTab === 'inventory' && (
         <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px', borderTop: '4px solid #0f766e' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>{isEditing ? "📝 Edit Product" : "➕ Add New Product"}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Price (₹)" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Qty" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} style={inputStyle} required />
              <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} style={inputStyle}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              <textarea placeholder="Product Description..." value={product.description || ''} onChange={(e) => setProduct({...product, description: e.target.value})} style={{ ...inputStyle, width: '100%', minHeight: '80px' }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc' }}><label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Product Image:</label><input type="file" onChange={(e) => handleImageUpload(e, false)} />{uploading && <span>⌛ Uploading...</span>}</div>
              <div style={{ width: '100%', display: 'flex', gap: '15px' }}>
                <button type="submit" disabled={uploading} style={{ backgroundColor: '#0f766e', color: 'white', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{isEditing ? "Save Changes" : "Publish Product"}</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setProduct({ name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' }); }} style={{ backgroundColor: '#64748b', color: 'white', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel Edit</button>}
              </div>
            </form>
          </section>
      )}
    </div>
  );
}

export default Admin;