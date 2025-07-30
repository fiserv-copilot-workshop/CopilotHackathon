import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import MonthSummary from '../components/MonthSummary';
import { ExpenseSummary } from '../services/expenseApi';
import { formatCurrency } from '../utils/formatters';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={{}}>
      {ui}
    </ThemeProvider>
  );
};

describe('MonthSummary', () => {
  const mockSummary: ExpenseSummary = {
    totalAmount: 300,
    totalExpenses: 5,
    startDate: '2025-07-01T00:00:00.000Z',
    endDate: '2025-07-31T23:59:59.999Z',
    categoryTotals: {
      'Food': 150,
      'Transport': 90,
      'Entertainment': 60
    }
  };
  
  it('renders the month summary correctly', () => {
    renderWithTheme(<MonthSummary summary={mockSummary} />);
    
    // Check for title (contains current month name)
    expect(screen.getByText(/summary/i)).toBeInTheDocument();
    
    // Check for total spending
    expect(screen.getByText('Total Spending')).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(mockSummary.totalAmount))).toBeInTheDocument();
    
    // Check for total expenses
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText(mockSummary.totalExpenses.toString())).toBeInTheDocument();
    
    // Chart is harder to test, but we can check for rendered category names
    Object.keys(mockSummary.categoryTotals).forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
  
  it('displays a message when there is no summary data', () => {
    renderWithTheme(<MonthSummary summary={null} />);
    
    expect(screen.getByText(/summary/i)).toBeInTheDocument();
    expect(screen.getByText(/no data available for this month/i)).toBeInTheDocument();
  });
});
