import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import ExpenseList from '../components/ExpenseList';
import { Expense } from '../services/expenseApi';
import { formatCurrency, formatDate } from '../utils/formatters';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={{}}>
      {ui}
    </ThemeProvider>
  );
};

describe('ExpenseList', () => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 42.5,
      category: 'Food',
      description: 'Groceries',
      date: '2025-07-20T12:00:00.000Z'
    },
    {
      id: '2',
      amount: 30.0,
      category: 'Transport',
      description: 'Gas',
      date: '2025-07-22T12:00:00.000Z'
    }
  ];
  
  const mockDeleteExpense = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the list of expenses correctly', () => {
    renderWithTheme(<ExpenseList expenses={mockExpenses} onDeleteExpense={mockDeleteExpense} />);
    
    // Check for header
    expect(screen.getByText('Expense List')).toBeInTheDocument();
    
    // Check for table headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check for expense data
    mockExpenses.forEach(expense => {
      expect(screen.getByText(expense.description)).toBeInTheDocument();
      expect(screen.getByText(expense.category)).toBeInTheDocument();
      expect(screen.getByText(formatDate(expense.date))).toBeInTheDocument();
      // Amount is formatted, but we can look for the formatted value
      const formattedAmount = formatCurrency(expense.amount);
      expect(screen.getByText(formattedAmount)).toBeInTheDocument();
    });
    
    // Check for delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
  });
  
  it('displays a message when there are no expenses', () => {
    renderWithTheme(<ExpenseList expenses={[]} onDeleteExpense={mockDeleteExpense} />);
    
    expect(screen.getByText(/no expenses recorded yet/i)).toBeInTheDocument();
  });
  
  it('calls onDeleteExpense when delete button is clicked', () => {
    renderWithTheme(<ExpenseList expenses={mockExpenses} onDeleteExpense={mockDeleteExpense} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    deleteButtons[0].click();
    
    expect(mockDeleteExpense).toHaveBeenCalledWith(mockExpenses[0].id);
  });
});
