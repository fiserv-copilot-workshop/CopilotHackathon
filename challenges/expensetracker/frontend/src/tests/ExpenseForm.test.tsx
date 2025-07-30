import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpenseForm from '../components/ExpenseForm';
import { theme } from '../theme';
import { expenseApi } from '../services/expenseApi';

// Mock the API service
jest.mock('../services/expenseApi', () => ({
  expenseApi: {
    getCategories: jest.fn(),
    createExpense: jest.fn()
  }
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {ui}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('ExpenseForm', () => {
  const mockOnExpenseAdded = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (expenseApi.getCategories as jest.Mock).mockResolvedValue([
      'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills'
    ]);
  });
  
  it('renders the form correctly', async () => {
    renderWithProviders(<ExpenseForm onExpenseAdded={mockOnExpenseAdded} />);
    
    // Check for main elements
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    
    // Wait for categories to load
    await waitFor(() => {
      expect(expenseApi.getCategories).toHaveBeenCalled();
    });
  });
  
  it('validates the form and shows error messages', async () => {
    renderWithProviders(<ExpenseForm onExpenseAdded={mockOnExpenseAdded} />);
    
    // Try to submit an empty form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
    
    // API should not be called with invalid data
    expect(expenseApi.createExpense).not.toHaveBeenCalled();
  });
  
  it('submits the form with valid data', async () => {
    renderWithProviders(<ExpenseForm onExpenseAdded={mockOnExpenseAdded} />);
    
    // Mock successful API response
    (expenseApi.createExpense as jest.Mock).mockResolvedValue({
      id: '123',
      amount: 42.5,
      category: 'Food',
      description: 'Groceries',
      date: new Date().toISOString()
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '42.5' } });
    
    // Wait for categories to load before trying to select one
    await waitFor(() => {
      expect(expenseApi.getCategories).toHaveBeenCalled();
    });
    
    // Select a category
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.mouseDown(categorySelect);
    
    // Wait for dropdown to appear and select an option
    const foodOption = await screen.findByText('Food');
    fireEvent.click(foodOption);
    
    // Add description
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Groceries' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(submitButton);
    
    // Check that API was called with correct data
    await waitFor(() => {
      expect(expenseApi.createExpense).toHaveBeenCalledWith(expect.objectContaining({
        amount: 42.5,
        category: 'Food',
        description: 'Groceries'
      }));
      expect(mockOnExpenseAdded).toHaveBeenCalled();
    });
  });
});
