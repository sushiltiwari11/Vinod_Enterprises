import React from 'react';

const Invoice = ({ order }) => {
  const handlePrint = () => window.print();
  if (!order) return null;

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: 'white', color: '#333' }}>
      <style>{`@media print { .no-print { display: none !important; } body { background-color: white; } }`}</style>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={handlePrint} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>🖨️ Print / Download PDF</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>VINOD ENTERPRISES</h1>
          <p style={{ margin: '2px 0', fontSize: '0.9rem', color: '#475569' }}>Plot no.1 A/1, D Block, Shyam Vihar</p>
          <p style={{ margin: '2px 0', fontSize: '0.9rem', color: '#475569' }}>Phase-1, Najafgarh, New Delhi-110043</p>
          <p style={{ margin: '2px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>GSTIN: 07EFDPS7538D1Z7</p>
          <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>📞 9999642530, 9818962487</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#0d9488', fontSize: '1.8rem' }}>TAX INVOICE</h2>
          {/* MAGIC: Now it shows our new Order ID! */}
          <p style={{ margin: '2px 0', fontSize: '0.9rem' }}><strong>Order ID:</strong> {order.order_id || `#${order.id}`}</p>
          <p style={{ margin: '2px 0', fontSize: '0.9rem' }}><strong>Date:</strong> {orderDate}</p>
          <p style={{ margin: '2px 0', fontSize: '0.9rem', textTransform: 'uppercase' }}><strong>Status:</strong> {order.status}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>BILL TO / SHIP TO:</h3>
        <p style={{ margin: '2px 0', fontWeight: 'bold', fontSize: '1rem' }}>{order.customer_name}</p>
        <p style={{ margin: '2px 0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{order.shipping_address}</p>
        <p style={{ margin: '2px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {order.customer_phone}</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#334155' }}>Item Description</th><th style={{ padding: '12px', textAlign: 'center', color: '#334155' }}>Qty</th><th style={{ padding: '12px', textAlign: 'right', color: '#334155' }}>Price</th><th style={{ padding: '12px', textAlign: 'right', color: '#334155' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px', textAlign: 'left' }}>{item.name || item.title}</td><td style={{ padding: '12px', textAlign: 'center' }}>{item.qty || item.quantity}</td><td style={{ padding: '12px', textAlign: 'right' }}>₹{item.price}</td><td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>₹{item.price * (item.qty || item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #0f172a', fontWeight: '900', fontSize: '1.2rem' }}><span>Grand Total:</span><span>₹{order.total_amount}</span></div>
          <p style={{ margin: '0', fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>All prices are inclusive of GST</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '20px', color: '#475569', fontSize: '0.75rem', lineHeight: '1.5' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Terms & Conditions:</h4>
        <ol style={{ margin: 0, paddingLeft: '15px' }}>
          <li>Goods once sold will not be taken back or exchanged unless proven defective upon delivery.</li>
          <li>Liability is restricted to the replacement of defective goods only.</li>
        </ol>
        <p style={{ textAlign: 'center', marginTop: '30px', fontWeight: 'bold', fontSize: '0.9rem', color: '#0f172a' }}>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default Invoice;