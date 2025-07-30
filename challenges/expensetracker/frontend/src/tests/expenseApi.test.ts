import { expenseApi } from '../services/expenseApi';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Expense API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAllExpenses fetches expenses from the API', async () => {
    const mockExpenses = [
      { id: '1', amount: 50, category: 'Food', description: 'Lunch', date: '2025-07-30' },
      { id: '2', amount: 30, category: 'Transport', description: 'Bus', date: '2025-07-29' }
    ];
    
    mockedAxios.get.mockResolvedValue({ data: mockExpenses });
    
    const result = await expenseApi.getAllExpenses();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses');
    expect(result).toEqual(mockExpenses);
  });

  it('getExpenseById fetches a specific expense', async () => {
    const mockExpense = { id: '1', amount: 50, category: 'Food', description: 'Lunch', date: '2025-07-30' };
    
    mockedAxios.get.mockResolvedValue({ data: mockExpense });
    
    const result = await expenseApi.getExpenseById('1');
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/1');
    expect(result).toEqual(mockExpense);
  });

  it('createExpense creates a new expense', async () => {
    const newExpense = { amount: 50, category: 'Food', description: 'Lunch' };
    const createdExpense = { id: '1', ...newExpense, date: '2025-07-30' };
    
    mockedAxios.post.mockResolvedValue({ data: createdExpense });
    
    const result = await expenseApi.createExpense(newExpense);
    
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/expenses', newExpense);
    expect(result).toEqual(createdExpense);
  });

  it('deleteExpense deletes an expense', async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });
    
    await expenseApi.deleteExpense('1');
    
    expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:5000/api/expenses/1');
  });

  it('getExpensesByFilter fetches expenses with filters', async () => {
    const filter = { category: 'Food', startDate: '2025-07-01', endDate: '2025-07-31' };
    const mockExpenses = [
      { id: '1', amount: 50, category: 'Food', description: 'Lunch', date: '2025-07-30' }
    ];
    
    mockedAxios.get.mockResolvedValue({ data: mockExpenses });
    
    const result = await expenseApi.getExpensesByFilter(filter);
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/filter', { params: filter });
    expect(result).toEqual(mockExpenses);
  });

  it('getCurrentMonthSummary fetches the current month summary', async () => {
    const mockSummary = {
      totalAmount: 300,
      totalExpenses: 5,
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      categoryTotals: { 'Food': 150, 'Transport': 150 }
    };
    
    mockedAxios.get.mockResolvedValue({ data: mockSummary });
    
    const result = await expenseApi.getCurrentMonthSummary();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/summary/month');
    expect(result).toEqual(mockSummary);
  });

  it('getCategorySummary fetches the category summary', async () => {
    const mockSummary = [
      { category: 'Food', amount: 150, percentage: 50 },
      { category: 'Transport', amount: 150, percentage: 50 }
    ];
    
    mockedAxios.get.mockResolvedValue({ data: mockSummary });
    
    const result = await expenseApi.getCategorySummary();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/summary/categories');
    expect(result).toEqual(mockSummary);
  });

  it('getSummaryByDateRange fetches summary for a date range', async () => {
    const startDate = '2025-07-01';
    const endDate = '2025-07-31';
    const mockSummary = {
      totalAmount: 300,
      totalExpenses: 5,
      startDate,
      endDate,
      categoryTotals: { 'Food': 150, 'Transport': 150 }
    };
    
    mockedAxios.get.mockResolvedValue({ data: mockSummary });
    
    const result = await expenseApi.getSummaryByDateRange(startDate, endDate);
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/summary/daterange', {
      params: { startDate, endDate }
    });
    expect(result).toEqual(mockSummary);
  });

  it('getCategories fetches the expense categories', async () => {
    const mockCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills'];
    
    mockedAxios.get.mockResolvedValue({ data: mockCategories });
    
    const result = await expenseApi.getCategories();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/expenses/categories');
    expect(result).toEqual(mockCategories);
  });
});
