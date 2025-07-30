import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { expenseApi, CreateExpenseDto } from '../services/expenseApi';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onExpenseAdded }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateExpenseDto>({
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString()
  });
  
  const [errors, setErrors] = useState({
    amount: '',
    category: '',
    description: ''
  });
  
  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await expenseApi.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when field is updated
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle category select change
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
    
    setErrors(prev => ({
      ...prev,
      category: ''
    }));
  };
  
  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString()
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      amount: '',
      category: '',
      description: ''
    };
    let isValid = true;
    
    // Amount validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      isValid = false;
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await expenseApi.createExpense(formData);
      
      // Reset form
      setFormData({
        amount: 0,
        category: '',
        description: '',
        date: new Date().toISOString()
      });
      
      // Notify parent component about the new expense
      onExpenseAdded();
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };
  
  return (
    <Card sx={{ mb: 3, p: 1 }} elevation={2}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Expense
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Amount"
                name="amount"
                value={formData.amount === 0 ? '' : formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                inputProps={{ step: "0.01", min: "0.01" }}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                required 
                error={!!errors.category}
                margin="normal"
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={new Date(formData.date || new Date())}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                margin="normal"
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  Add Expense
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
