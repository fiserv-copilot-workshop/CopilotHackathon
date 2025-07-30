import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, removeFromCart } = useCart();
  
  const handleCartAction = () => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };
  
  return (
    <div className="product-card">
        {
            product.image_url && (<img 
        src={product.image_url} 
        alt={product.name} 
        className="product-image"
      />)
        }
      <div className="product-name">{product.name}</div>
      <div className="product-price">${product.price.toFixed(2)}</div>
      <p>{product.manufacturer}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <Link to={`/product/${product.id}`} className="btn btn-primary">
          View Details
        </Link>
        <button 
          className={`btn ${isInCart(product.id) ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleCartAction}
        >
          {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
