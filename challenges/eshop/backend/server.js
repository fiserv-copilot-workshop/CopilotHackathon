const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load automobile parts data
const automobilePartsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../automobileParts.json'), 'utf8')
);

// Routes

// Get automobile parts list with pagination
app.get('/api/parts', (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;
  
  const paginatedParts = automobilePartsData.slice(offset, offset + limit);
  
  res.json({
    total: automobilePartsData.length,
    offset,
    limit,
    parts: paginatedParts
  });
});

// Get automobile part details by id
app.get('/api/parts/:id', (req, res) => {
  const partId = parseInt(req.params.id);
  const part = automobilePartsData.find(part => part.id === partId);
  
  if (!part) {
    return res.status(404).json({ message: 'Part not found' });
  }
  
  res.json(part);
});

// Search automobile parts by name, description, manufacturer, price
app.get('/api/search', (req, res) => {
  let filteredParts = [...automobilePartsData];
  const { query, manufacturer, minPrice, maxPrice } = req.query;
  
  if (query) {
    filteredParts = filteredParts.filter(part => 
      part.name.toLowerCase().includes(query.toLowerCase()) ||
      part.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (manufacturer) {
    filteredParts = filteredParts.filter(part => 
      part.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
    );
  }
  
  if (minPrice) {
    filteredParts = filteredParts.filter(part => 
      part.price >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredParts = filteredParts.filter(part => 
      part.price <= parseFloat(maxPrice)
    );
  }
  
  res.json(filteredParts);
  
  res.json(filteredParts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
