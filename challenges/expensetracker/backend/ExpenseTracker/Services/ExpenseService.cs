using ExpenseTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly List<Expense> _expenses = new List<Expense>();

        public ExpenseService()
        {
            // Add some initial sample data
            _expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Amount = 42.50m,
                Category = "Food",
                Date = DateTime.Now.AddDays(-5),
                Description = "Grocery shopping"
            });

            _expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Amount = 30.00m,
                Category = "Transport",
                Date = DateTime.Now.AddDays(-3),
                Description = "Gas refill"
            });

            _expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Amount = 120.00m,
                Category = "Entertainment",
                Date = DateTime.Now.AddDays(-10),
                Description = "Movie tickets and dinner"
            });

            _expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Amount = 75.25m,
                Category = "Shopping",
                Date = DateTime.Now.AddDays(-1),
                Description = "New clothes"
            });

            _expenses.Add(new Expense
            {
                Id = Guid.NewGuid(),
                Amount = 150.00m,
                Category = "Bills",
                Date = DateTime.Now.AddDays(-15),
                Description = "Electricity bill"
            });
        }

        public Task<List<Expense>> GetAllExpensesAsync()
        {
            return Task.FromResult(_expenses.OrderByDescending(e => e.Date).ToList());
        }

        public Task<Expense> GetExpenseByIdAsync(Guid id)
        {
            var expense = _expenses.FirstOrDefault(e => e.Id == id);
            return Task.FromResult(expense);
        }

        public Task<List<Expense>> GetExpensesByFilterAsync(ExpenseFilterDto filter)
        {
            var query = _expenses.AsQueryable();

            if (filter.StartDate.HasValue)
            {
                query = query.Where(e => e.Date >= filter.StartDate.Value);
            }

            if (filter.EndDate.HasValue)
            {
                query = query.Where(e => e.Date <= filter.EndDate.Value);
            }

            if (!string.IsNullOrEmpty(filter.Category))
            {
                query = query.Where(e => e.Category == filter.Category);
            }

            return Task.FromResult(query.OrderByDescending(e => e.Date).ToList());
        }

        public Task<Expense> AddExpenseAsync(CreateExpenseDto expenseDto)
        {
            var expense = new Expense
            {
                Id = Guid.NewGuid(),
                Amount = expenseDto.Amount,
                Category = expenseDto.Category,
                Date = expenseDto.Date ?? DateTime.Now,
                Description = expenseDto.Description
            };

            _expenses.Add(expense);
            return Task.FromResult(expense);
        }

        public Task<bool> DeleteExpenseAsync(Guid id)
        {
            var expense = _expenses.FirstOrDefault(e => e.Id == id);
            if (expense == null)
            {
                return Task.FromResult(false);
            }

            _expenses.Remove(expense);
            return Task.FromResult(true);
        }

        public Task<ExpenseSummary> GetCurrentMonthSummaryAsync()
        {
            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            return GetSummaryByDateRangeAsync(startOfMonth, endOfMonth);
        }

        public Task<List<CategorySummary>> GetCategorySummaryAsync()
        {
            var totalExpenses = _expenses.Sum(e => e.Amount);
            
            var categorySummaries = _expenses
                .GroupBy(e => e.Category)
                .Select(g => new CategorySummary
                {
                    Category = g.Key,
                    Amount = g.Sum(e => e.Amount),
                    Percentage = totalExpenses > 0 ? (g.Sum(e => e.Amount) / totalExpenses) * 100 : 0
                })
                .OrderByDescending(c => c.Amount)
                .ToList();

            return Task.FromResult(categorySummaries);
        }

        public Task<ExpenseSummary> GetSummaryByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var filteredExpenses = _expenses
                .Where(e => e.Date >= startDate && e.Date <= endDate)
                .ToList();

            var categoryTotals = filteredExpenses
                .GroupBy(e => e.Category)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

            var summary = new ExpenseSummary
            {
                TotalAmount = filteredExpenses.Sum(e => e.Amount),
                TotalExpenses = filteredExpenses.Count,
                StartDate = startDate,
                EndDate = endDate,
                CategoryTotals = categoryTotals
            };

            return Task.FromResult(summary);
        }
    }
}
