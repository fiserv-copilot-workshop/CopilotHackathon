import { format, parseISO } from 'date-fns';

// Format a date string
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

// Format currency amount
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get the current month name
export const getCurrentMonthName = (): string => {
  return format(new Date(), 'MMMM yyyy');
};

// Format percentage value
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Get color for category
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Food': '#4caf50', // Green
    'Transport': '#2196f3', // Blue
    'Entertainment': '#673ab7', // Purple
    'Shopping': '#f44336', // Red
    'Bills': '#ff9800', // Orange
    'Other': '#607d8b', // Blue Grey
  };

  return colorMap[category] || colorMap['Other'];
};

// Generate random pastel colors for chart
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#4caf50', // Green
    '#2196f3', // Blue
    '#673ab7', // Purple
    '#f44336', // Red
    '#ff9800', // Orange
    '#607d8b', // Blue Grey
    '#e91e63', // Pink
    '#00bcd4', // Cyan
    '#8bc34a', // Light Green
    '#ffc107', // Amber
  ];

  // If we need more colors than we have, duplicate and modify slightly
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }

  return result;
};
