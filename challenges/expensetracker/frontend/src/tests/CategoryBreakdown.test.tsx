import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import CategoryBreakdown from '../components/CategoryBreakdown';
import { CategorySummary } from '../services/expenseApi';
import { formatCurrency } from '../utils/formatters';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={{}}>
      {ui}
    </ThemeProvider>
  );
};

describe('CategoryBreakdown', () => {
  const mockCategorySummary: CategorySummary[] = [
    {
      category: 'Food',
      amount: 150,
      percentage: 50
    },
    {
      category: 'Transport',
      amount: 90,
      percentage: 30
    },
    {
      category: 'Entertainment',
      amount: 60,
      percentage: 20
    }
  ];
  
  const totalAmount = 300;
  
  it('renders the category breakdown correctly', () => {
    renderWithTheme(
      <CategoryBreakdown 
        categorySummary={mockCategorySummary} 
        totalAmount={totalAmount} 
      />
    );
    
    // Check for title
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    
    // Check for total spending
    expect(screen.getByText('Total Spending')).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(totalAmount))).toBeInTheDocument();
    
    // Check for top categories
    expect(screen.getByText('Top Categories')).toBeInTheDocument();
    
    // Check that each category is displayed
    mockCategorySummary.forEach(category => {
      expect(screen.getByText(category.category)).toBeInTheDocument();
      expect(screen.getByText(formatCurrency(category.amount))).toBeInTheDocument();
    });
  });
  
  it('displays a message when there are no category data', () => {
    renderWithTheme(
      <CategoryBreakdown 
        categorySummary={[]} 
        totalAmount={0} 
      />
    );
    
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    expect(screen.getByText(/no expense data available/i)).toBeInTheDocument();
  });
});
