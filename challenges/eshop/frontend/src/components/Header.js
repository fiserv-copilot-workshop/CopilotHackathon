import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { getCartCount } = useCart();
  
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav-link">
            <div className="nav-title">Automobile Parts Shop</div>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/cart" className="nav-link">
              Cart
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
