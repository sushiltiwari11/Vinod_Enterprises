import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  // NEW: Added 'description' to the state
  const [product, setProduct] = useState({ 
    name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' 
  });

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
    setLoading(false);
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchDashboardData();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    try {
      await supabase.storage.from('product-images').upload(fileName, file);
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setProduct({ ...product, image_url: urlData.publicUrl });
    } catch (error) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...product, price: Number(product.price), quantity: Number(product.quantity) };
    
    try {
      if (isEditing) {
        await supabase.from('products').update(productData).eq('id', currentProductId);
        alert("Product Updated!");
      } else {
        await supabase.from('products').insert([productData]);
        alert("Product Added!");
      }
      // Reset form including description
      setProduct({ name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' });
      setIsEditing(false);
      setCurrentProductId(null);
      fetchDashboardData(); 
    } catch (error) {
      alert("Error saving product: " + error.message);
    }
  };

  const startEdit = (p) => {
    setIsEditing(true);
    setCurrentProductId(p.id);
    setProduct(p);
    setActiveTab('inventory'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this product permanently?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  const toggleStock = async (id, currentStatus) => {
    const newStatus = currentStatus === 'In Stock' ? 'Stock Out' : 'In Stock';
    await supabase.from('products').update({ status: newStatus }).eq('id', id);
    fetchDashboardData();
  };

  const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: '1 1 200px', fontSize: '1rem' };
  const tabStyle = (isActive) => ({ padding: '12px 25px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: isActive ? '#0f766e' : '#e2e8f0', color: isActive ? 'white' : '#475569' });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.5rem', color: '#0f766e' }}>Loading Command Center... ⚙️</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ color: '#0f172a', margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={tabStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Overview & Orders</button>
          <button style={tabStyle(activeTab === 'inventory')} onClick={() => setActiveTab('inventory')}>📦 Manage Inventory</button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          {/* STATS & ORDERS (Kept exactly the same as before to save space) */}
          <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Recent Orders</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Order Info</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Customer Details</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Shipping Address</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Items Ordered</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px' }}><strong>#{order.id}</strong><br/><small>{order.order_date}</small></td>
                    <td style={{ padding: '15px' }}>{order.shipping_details?.name}<br/><small>📞 {order.shipping_details?.phone}</small></td>
                    <td style={{ padding: '15px' }}>{order.shipping_details?.city} - {order.shipping_details?.pincode}</td>
                    <td style={{ padding: '15px' }}>{order.items?.length} items</td>
                    <td style={{ padding: '15px' }}>
                      <select value={order.status} onChange={(e) => handleOrderStatusChange(order.id, e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
                        <option value="Awaiting Payment Verification">Awaiting Payment</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px', borderTop: '4px solid #0f766e' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>{isEditing ? "📝 Edit Product" : "➕ Add New Product"}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Price (₹)" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Qty" value={product.quantity} onChange={(e) => setProduct({...product, quantity: e.target.value})} style={inputStyle} required />
              
              <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} style={inputStyle}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              {/* NEW: Description Text Area */}
              <textarea 
                placeholder="Product Description (e.g. 'Heavy duty floor cleaner for marble...')" 
                value={product.description || ''} 
                onChange={(e) => setProduct({...product, description: e.target.value})} 
                style={{ ...inputStyle, width: '100%', minHeight: '80px' }} 
              />

              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Upload Image:</label>
                <input type="file" onChange={handleImageUpload} style={{ fontSize: '0.85rem' }} />
                {uploading && <span>⌛ Uploading...</span>}
              </div>

              <div style={{ width: '100%', display: 'flex', gap: '15px' }}>
                <button type="submit" disabled={uploading} style={{ backgroundColor: '#0f766e', color: 'white', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {uploading ? "Uploading Image..." : isEditing ? "Save Changes" : "Publish to Store"}
                </button>
                {isEditing && (
                  <button type="button" onClick={() => { setIsEditing(false); setProduct({ name: '', price: '', category: 'Floor Care', quantity: 10, status: 'In Stock', image_url: '', description: '' }); }} style={{ backgroundColor: '#64748b', color: 'white', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Current Inventory</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Product</th>
                  <th style={{ padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569' }}>Price & Stock</th>
                  <th style={{ padding: '15px', textAlign: 'right', backgroundColor: '#f8fafc', color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{p.name}</strong><br/>
                      <small style={{ color: '#64748b' }}>{p.category}</small>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>₹{p.price}</div>
                      <div style={{ fontSize: '0.85rem', color: p.status === 'In Stock' ? '#166534' : '#991b1b', fontWeight: 'bold' }}>{p.status} ({p.quantity})</div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button onClick={() => startEdit(p)} style={{ cursor: 'pointer', backgroundColor: 'transparent', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => toggleStock(p.id, p.status)} style={{ cursor: 'pointer', backgroundColor: 'transparent', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '8px' }}>Stock Toggle</button>
                      <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;