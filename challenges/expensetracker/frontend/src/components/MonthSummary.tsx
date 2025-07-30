import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseSummary } from '../services/expenseApi';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { getCurrentMonthName } from '../utils/formatters';

interface MonthSummaryProps {
  summary: ExpenseSummary | null;
}

const MonthSummary: React.FC<MonthSummaryProps> = ({ summary }) => {
  if (!summary) {
    return (
      <Card sx={{ height: '100%' }} elevation={2}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {getCurrentMonthName()} Summary
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Typography variant="body1" color="textSecondary">
              No data available for this month
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for bar chart
  const chartData = Object.entries(summary.categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));

  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {getCurrentMonthName()} Summary
        </Typography>
        
        <Box display="flex" alignItems="center" mb={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Spending
            </Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(summary.totalAmount)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Expenses
            </Typography>
            <Typography variant="h4" color="secondary">
              {summary.totalExpenses}
            </Typography>
          </Box>
        </Box>
        
        <Box height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar 
                dataKey="amount" 
                name="Amount" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                fill="#2e7d32"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MonthSummary;
