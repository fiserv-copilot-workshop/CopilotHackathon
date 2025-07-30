import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    calculateTotal,
    clearCart 
  } = useCart();
  
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={item.image_url || 'https://via.placeholder.com/50'} 
              alt={item.name} 
              style={{ width: '50px', height: '50px', marginRight: '15px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/50';
              }}
            />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)} each</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
              <button 
                className="btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{ padding: '5px 10px' }}
              >
                -
              </button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button 
                className="btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{ padding: '5px 10px' }}
              >
                +
              </button>
            </div>
            
            <div style={{ textAlign: 'right', minWidth: '100px' }}>
              <div>${(item.price * item.quantity).toFixed(2)}</div>
              <button 
                className="btn btn-danger"
                onClick={() => removeFromCart(item.id)}
                style={{ marginTop: '5px' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div style={{ 
        borderTop: '1px solid #eee', 
        marginTop: '20px', 
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <button 
            className="btn btn-danger"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <button 
            className="btn"
            onClick={() => navigate('/')}
            style={{ marginLeft: '10px' }}
          >
            Continue Shopping
          </button>
        </div>
        
        <div>
          <h2>Total: ${calculateTotal().toFixed(2)}</h2>
          <button 
            className="btn btn-primary"
            onClick={() => alert('Checkout functionality would go here!')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
