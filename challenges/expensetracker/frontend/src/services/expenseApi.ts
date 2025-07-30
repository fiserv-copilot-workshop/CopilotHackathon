import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Types
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface CreateExpenseDto {
  amount: number;
  category: string;
  date?: string;
  description: string;
}

export interface ExpenseFilterDto {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  totalExpenses: number;
  startDate: string;
  endDate: string;
  categoryTotals: Record<string, number>;
}

// API Service
export const expenseApi = {
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await axios.get(`${API_URL}/expenses`);
    return response.data;
  },

  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await axios.get(`${API_URL}/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expense: CreateExpenseDto): Promise<Expense> => {
    const response = await axios.post(`${API_URL}/expenses`, expense);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/expenses/${id}`);
  },

  getExpensesByFilter: async (filter: ExpenseFilterDto): Promise<Expense[]> => {
    const response = await axios.get(`${API_URL}/expenses/filter`, { params: filter });
    return response.data;
  },

  getCurrentMonthSummary: async (): Promise<ExpenseSummary> => {
    const response = await axios.get(`${API_URL}/expenses/summary/month`);
    return response.data;
  },

  getCategorySummary: async (): Promise<CategorySummary[]> => {
    const response = await axios.get(`${API_URL}/expenses/summary/categories`);
    return response.data;
  },

  getSummaryByDateRange: async (startDate: string, endDate: string): Promise<ExpenseSummary> => {
    const response = await axios.get(`${API_URL}/expenses/summary/daterange`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/expenses/categories`);
    return response.data;
  }
};
