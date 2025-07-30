import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Add a product to the cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if product is already in cart
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If product exists, increase quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // If product doesn't exist, add it with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  
  // Remove a product from the cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };
  
  // Update product quantity in cart
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Calculate total price of all items in cart
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  };
  
  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  };
  
  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };
  
  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    getCartCount,
    isInCart,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
