import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Typography, 
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expense } from '../services/expenseApi';
import { formatDate, formatCurrency, getCategoryColor } from '../utils/formatters';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <Card sx={{ mb: 3 }} elevation={2}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <Typography variant="h6" color="textSecondary">
              No expenses recorded yet. Add your first expense above!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }} elevation={2}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Expense List
        </Typography>
        
        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="expense table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={expense.category} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getCategoryColor(expense.category),
                        color: 'white',
                        fontWeight: 'medium'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                    >
                      {formatCurrency(expense.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete Expense">
                      <IconButton 
                        aria-label="delete" 
                        color="error"
                        onClick={() => onDeleteExpense(expense.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
