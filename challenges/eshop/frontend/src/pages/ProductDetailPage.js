import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, removeFromCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/parts/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const handleCartAction = () => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };
  
  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;
  
  return (
    <div className="product-detail">
      <div className="product-detail-image">
        <img 
          src={product.image_url || 'https://via.placeholder.com/500'} 
          alt={product.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/500';
          }}
        />
      </div>
      
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <h2 className="product-price">${product.price.toFixed(2)}</h2>
        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
        <p><strong>Part Number:</strong> {product.part_number}</p>
        <p><strong>In Stock:</strong> {product.stock} units</p>
        <p><strong>Description:</strong> {product.description}</p>
        
        <div className="product-detail-specs">
          <h3>Specifications</h3>
          <p><strong>Weight:</strong> {product.specifications.weight}</p>
          <p><strong>Dimensions:</strong> {product.specifications.dimensions}</p>
          <p><strong>Material:</strong> {product.specifications.material}</p>
        </div>
        
        <div className="product-detail-compat">
          <h3>Compatible Models</h3>
          <ul>
            {product.model_compatibility.map((model, index) => (
              <li key={index}>{model}</li>
            ))}
          </ul>
        </div>
        
        <div className="product-detail-actions">
          <button 
            className={`btn ${isInCart(product.id) ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleCartAction}
            style={{ marginRight: '10px' }}
          >
            {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
          </button>
          
          <button 
            className="btn"
            onClick={() => navigate(-1)}
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
