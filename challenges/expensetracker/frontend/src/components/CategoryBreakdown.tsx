import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { CategorySummary } from '../services/expenseApi';
import { formatCurrency, formatPercentage, generateChartColors } from '../utils/formatters';

interface CategoryBreakdownProps {
  categorySummary: CategorySummary[];
  totalAmount: number;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categorySummary, totalAmount }) => {
  // Only show the chart if we have data
  if (!categorySummary.length) {
    return (
      <Card sx={{ height: '100%' }} elevation={2}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Category Breakdown
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Typography variant="body1" color="textSecondary">
              No expense data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Data for the pie chart
  const chartData = categorySummary.map(item => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage
  }));

  // Generate colors for the chart
  const colors = generateChartColors(categorySummary.length);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper elevation={3} sx={{ p: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2">
            {formatCurrency(data.value)} ({formatPercentage(data.percentage)})
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Category Breakdown
        </Typography>
        
        <Grid container>
          <Grid item xs={12} md={7}>
            <Box height={220} display="flex" alignItems="center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Total Spending
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatCurrency(totalAmount)}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                Top Categories
              </Typography>
              
              {categorySummary.slice(0, 3).map((category) => (
                <Box key={category.category} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {category.category}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(category.amount)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
