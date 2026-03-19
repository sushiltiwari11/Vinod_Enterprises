import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext'; 

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'lowToHigh', 'highToLow'

  const { addToCart } = useContext(CartContext);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (!error && data) {
      setProducts(data);
      const uniqueCategories = ['All', ...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // 1. First, filter by category
  let displayProducts = products.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  // 2. Then, sort by price
  if (sortOrder === 'lowToHigh') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  const getCategoryStyle = (category) => {
    const styles = {
      "Floor Care": { bg: "#e0f2fe", text: "#0369a1" },     
      "Kitchen Care": { bg: "#fef08a", text: "#854d0e" },   
      "Surface Care": { bg: "#fce7f3", text: "#be185d" },   
      "Restroom": { bg: "#e0e7ff", text: "#4338ca" },       
      "Heavy Duty": { bg: "#ffedd5", text: "#c2410c" },     
      "Hygiene": { bg: "#dcfce7", text: "#15803d" },        
    };
    return styles[category] || { bg: "#f3f4f6", text: "#4b5563" }; 
  };

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#0f766e', fontWeight: 'bold' }}>
        <span>✨ Loading Magic Inventory...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#0f172a', fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>
          Magic Cleaning <span style={{ color: '#0d9488' }}>Products</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Professional-grade housekeeping chemicals for every surface. Built for excellence by Vinod Enterprises.
        </p>
      </div>

      {/* --- FILTER & SORT CONTROL BAR --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s',
                backgroundColor: selectedCategory === category ? '#0f172a' : '#ffffff',
                color: selectedCategory === category ? '#ffffff' : '#475569',
                boxShadow: selectedCategory === category ? '0 4px 10px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Price Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>Sort By:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: '600', color: '#0f172a', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="default">Newest Arrivals</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {/* --- PRODUCT GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', justifyContent: 'center' }}>
        
        {displayProducts.length === 0 && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8', fontSize: '1.1rem', marginTop: '40px' }}>
            No products found matching your criteria.
          </p>
        )}

        {displayProducts.map(product => {
          const catStyle = getCategoryStyle(product.category);
          
          return (
            <div key={product.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              
              <div style={{ backgroundColor: catStyle.bg, padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.9)', color: catStyle.text, padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' }}>
                  {product.category}
                </span>

                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }} />
                ) : (
                  <span style={{ fontSize: '4rem', opacity: 0.5 }}>🧴</span>
                )}
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '800', lineHeight: '1.3' }}>
                  {product.name}
                </h3>
                
                {/* NEW: Product Description Display */}
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 20px 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || "Premium industrial-grade cleaning solution formulated by Vinod Enterprises."}
                </p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>₹{product.price}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: product.status === 'In Stock' ? '#16a34a' : '#dc2626', backgroundColor: product.status === 'In Stock' ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px' }}>
                    {product.status}
                  </span>
                </div>
                
                <button 
                  onClick={() => addToCart(product)} 
                  disabled={product.status !== 'In Stock'}
                  style={{ 
                    width: '100%', padding: '14px', color: 'white', border: 'none', borderRadius: '8px', 
                    cursor: product.status === 'In Stock' ? 'pointer' : 'not-allowed', 
                    fontWeight: '800', fontSize: '1rem',
                    backgroundColor: product.status === 'In Stock' ? '#ea580c' : '#cbd5e1',
                    transition: 'all 0.2s',
                    boxShadow: product.status === 'In Stock' ? '0 4px 12px rgba(234, 88, 12, 0.3)' : 'none'
                  }}
                >
                  {product.status === 'In Stock' ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Products;