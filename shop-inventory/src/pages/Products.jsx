import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { CartContext } from '../context/CartContext'; 
import toast from 'react-hot-toast';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [sortOrder, setSortOrder] = useState('default');

  // Bring in the extra cart functions!
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

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

  // Filter & Sort Logic
  let displayProducts = products.filter(product => selectedCategory === 'All' || product.category === selectedCategory);
  if (sortOrder === 'lowToHigh') displayProducts.sort((a, b) => a.price - b.price);
  else if (sortOrder === 'highToLow') displayProducts.sort((a, b) => b.price - a.price);

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

  // Add notification wrapper
  const handleInitialAdd = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#0f766e', fontWeight: 'bold' }}><span>✨ Loading Magic Inventory...</span></div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      {/* ... [Header and Filters remain the same] ... */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#0f172a', fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>Magic Cleaning <span style={{ color: '#0d9488' }}>Products</span></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', justifyContent: 'center' }}>
        {displayProducts.map(product => {
          const catStyle = getCategoryStyle(product.category);
          
          // Check if it's already in cart
          const itemInCart = cart.find(c => c.id === product.id);
          const currentQty = itemInCart ? (itemInCart.qty || 1) : 0;
          
          return (
            <div key={product.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              
              <div style={{ backgroundColor: catStyle.bg, padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(255,255,255,0.9)', color: catStyle.text, padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' }}>{product.category}</span>
                {product.image_url ? <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '4rem', opacity: 0.5 }}>🧴</span>}
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '800' }}>{product.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description || "Premium industrial-grade cleaning solution."}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>₹{product.price}</span>
                </div>
                
                {/* THE NEW SMART BUTTONS */}
                {!itemInCart ? (
                   <button 
                   onClick={() => handleInitialAdd(product)} 
                   disabled={product.status !== 'In Stock'}
                   style={{ width: '100%', padding: '14px', color: 'white', border: 'none', borderRadius: '8px', cursor: product.status === 'In Stock' ? 'pointer' : 'not-allowed', fontWeight: '800', backgroundColor: product.status === 'In Stock' ? '#ea580c' : '#cbd5e1' }}
                 >
                   {product.status === 'In Stock' ? 'Add to Cart' : 'Out of Stock'}
                 </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => currentQty === 1 ? removeFromCart(product.id) : updateQuantity(product.id, currentQty - 1)} style={{ backgroundColor: 'transparent', border: 'none', padding: '14px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>-</button>
                    <span style={{ fontWeight: '900', color: '#0f172a' }}>{currentQty} in cart</span>
                    <button onClick={() => updateQuantity(product.id, currentQty + 1)} style={{ backgroundColor: 'transparent', border: 'none', padding: '14px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}>+</button>
                  </div>
                )}

              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Products;