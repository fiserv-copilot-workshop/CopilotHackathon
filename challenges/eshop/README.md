# Automobile Parts Shop

A full-stack application for an automobile parts e-commerce site built with Node.js, Express, and React.

## Features

- Browse automobile parts with pagination
- Search and filter parts by name, description, and price range
- View detailed information about each part
- Add/remove items to/from cart
- Calculate total price in the shopping cart

## Project Structure

```
/eshop
  /backend            # Node.js/Express API
    server.js         # Main server file
    package.json      # Backend dependencies
  /frontend           # React frontend
    /public           # Static files
    /src              # React source code
      /components     # Reusable UI components
      /context        # React context for state management
      /pages          # Page components
    package.json      # Frontend dependencies
  automobileParts.json # Sample data
  README.md           # This file
```

## How to Run

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   The API will be available at http://localhost:5000

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The application will be available at http://localhost:3000

## API Endpoints

- `GET /api/parts?offset=0&limit=10` - Get a paginated list of parts
- `GET /api/parts/:id` - Get details for a specific part
- `GET /api/search?query=term&minPrice=10&maxPrice=100` - Search parts by name, description with optional price filtering

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, React Router, Context API
- **Styling**: CSS
