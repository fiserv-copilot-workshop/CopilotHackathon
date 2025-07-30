using ExpenseTracker.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseTracker.Services
{
    public interface IExpenseService
    {
        Task<List<Expense>> GetAllExpensesAsync();
        Task<Expense> GetExpenseByIdAsync(Guid id);
        Task<List<Expense>> GetExpensesByFilterAsync(ExpenseFilterDto filter);
        Task<Expense> AddExpenseAsync(CreateExpenseDto expenseDto);
        Task<bool> DeleteExpenseAsync(Guid id);
        Task<ExpenseSummary> GetCurrentMonthSummaryAsync();
        Task<List<CategorySummary>> GetCategorySummaryAsync();
        Task<ExpenseSummary> GetSummaryByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}
