import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, AppBar, Toolbar, CssBaseline, CircularProgress, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryBreakdown from './components/CategoryBreakdown';
import MonthSummary from './components/MonthSummary';
import { expenseApi, Expense, CategorySummary, ExpenseSummary } from './services/expenseApi';
import { theme } from './theme';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [monthSummary, setMonthSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all expenses
      const expensesData = await expenseApi.getAllExpenses();
      setExpenses(expensesData);
      
      // Load category summary
      const categorySummaryData = await expenseApi.getCategorySummary();
      setCategorySummary(categorySummaryData);
      
      // Load month summary
      const monthSummaryData = await expenseApi.getCurrentMonthSummary();
      setMonthSummary(monthSummaryData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle expense deletion
  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseApi.deleteExpense(id);
      // Reload data after deletion
      loadData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Expense Tracker
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <ExpenseForm onExpenseAdded={loadData} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 3 }}>
                  <Box sx={{ flex: '1 1 60%' }}>
                    <ExpenseList 
                      expenses={expenses} 
                      onDeleteExpense={handleDeleteExpense} 
                    />
                  </Box>
                  
                  <Box sx={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <MonthSummary summary={monthSummary} />
                    <CategoryBreakdown 
                      categorySummary={categorySummary}
                      totalAmount={monthSummary?.totalAmount || 0}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
