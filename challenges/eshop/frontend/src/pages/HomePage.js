import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * productsPerPage;
      const response = await axios.get(`/api/parts?offset=${offset}&limit=${productsPerPage}`);
      setProducts(response.data.parts);
      setTotalProducts(response.data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let url = '/api/search?';
      
      if (searchQuery) {
        url += `query=${searchQuery}&`;
      }
      
      if (minPrice) {
        url += `minPrice=${minPrice}&`;
      }
      
      if (maxPrice) {
        url += `maxPrice=${maxPrice}&`;
      }
      
      const response = await axios.get(url);
      setProducts(response.data);
      setTotalProducts(response.data.length);
      setLoading(false);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      setLoading(false);
    }
  };
  
  const resetSearch = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
    fetchProducts();
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  return (
    <div>
      <h1>Automobile Parts</h1>
      
      <div className="search-bar">
        <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className="btn" onClick={resetSearch}>Reset</button>
          </div>
          
          <div className="price-filter">
            <h3>Filter by Price</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <label htmlFor="min-price">Min Price ($): </label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="max-price">Max Price ($): </label>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                className="btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(page => page - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                className="btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(page => page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
