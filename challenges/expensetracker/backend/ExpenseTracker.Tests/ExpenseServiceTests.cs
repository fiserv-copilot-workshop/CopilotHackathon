using ExpenseTracker.Models;
using ExpenseTracker.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ExpenseTracker.Tests
{
    public class ExpenseServiceTests
    {
        private readonly ExpenseService _service;

        public ExpenseServiceTests()
        {
            _service = new ExpenseService();
        }

        [Fact]
        public async Task GetAllExpensesAsync_ReturnsAllExpenses()
        {
            // Act
            var result = await _service.GetAllExpensesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Count >= 5); // We know the service initializes with 5 expenses
        }

        [Fact]
        public async Task GetExpenseByIdAsync_WithValidId_ReturnsExpense()
        {
            // Arrange
            var expenses = await _service.GetAllExpensesAsync();
            var firstExpense = expenses.First();

            // Act
            var result = await _service.GetExpenseByIdAsync(firstExpense.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(firstExpense.Id, result.Id);
            Assert.Equal(firstExpense.Amount, result.Amount);
            Assert.Equal(firstExpense.Category, result.Category);
        }

        [Fact]
        public async Task GetExpenseByIdAsync_WithInvalidId_ReturnsNull()
        {
            // Arrange
            var invalidId = Guid.NewGuid();

            // Act
            var result = await _service.GetExpenseByIdAsync(invalidId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddExpenseAsync_AddsNewExpense()
        {
            // Arrange
            var initialCount = (await _service.GetAllExpensesAsync()).Count;
            var newExpense = new CreateExpenseDto
            {
                Amount = 99.99m,
                Category = "Test Category",
                Description = "Test Description",
                Date = DateTime.Now
            };

            // Act
            var result = await _service.AddExpenseAsync(newExpense);
            var updatedCount = (await _service.GetAllExpensesAsync()).Count;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(newExpense.Amount, result.Amount);
            Assert.Equal(newExpense.Category, result.Category);
            Assert.Equal(newExpense.Description, result.Description);
            Assert.Equal(initialCount + 1, updatedCount);
        }

        [Fact]
        public async Task DeleteExpenseAsync_WithValidId_RemovesExpense()
        {
            // Arrange
            var newExpense = new CreateExpenseDto
            {
                Amount = 99.99m,
                Category = "Test Category",
                Description = "Test Description"
            };
            var addedExpense = await _service.AddExpenseAsync(newExpense);
            var initialCount = (await _service.GetAllExpensesAsync()).Count;

            // Act
            var result = await _service.DeleteExpenseAsync(addedExpense.Id);
            var updatedCount = (await _service.GetAllExpensesAsync()).Count;

            // Assert
            Assert.True(result);
            Assert.Equal(initialCount - 1, updatedCount);
        }

        [Fact]
        public async Task DeleteExpenseAsync_WithInvalidId_ReturnsFalse()
        {
            // Arrange
            var invalidId = Guid.NewGuid();

            // Act
            var result = await _service.DeleteExpenseAsync(invalidId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetExpensesByFilterAsync_WithCategoryFilter_ReturnsFilteredExpenses()
        {
            // Arrange
            var filter = new ExpenseFilterDto { Category = "Food" };

            // Act
            var result = await _service.GetExpensesByFilterAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.All(result, expense => Assert.Equal("Food", expense.Category));
        }

        [Fact]
        public async Task GetExpensesByFilterAsync_WithDateFilter_ReturnsFilteredExpenses()
        {
            // Arrange
            var today = DateTime.Now.Date;
            var startDate = today.AddDays(-10);
            var endDate = today;
            var filter = new ExpenseFilterDto { StartDate = startDate, EndDate = endDate };

            // Act
            var result = await _service.GetExpensesByFilterAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.All(result, expense => 
                Assert.True(expense.Date >= startDate && expense.Date <= endDate.AddDays(1).AddTicks(-1)));
        }

        [Fact]
        public async Task GetCurrentMonthSummaryAsync_ReturnsSummaryForCurrentMonth()
        {
            // Act
            var result = await _service.GetCurrentMonthSummaryAsync();

            // Assert
            Assert.NotNull(result);
            
            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
            
            Assert.Equal(startOfMonth, result.StartDate);
            Assert.Equal(endOfMonth, result.EndDate);
        }

        [Fact]
        public async Task GetCategorySummaryAsync_ReturnsCategorySummaries()
        {
            // Act
            var result = await _service.GetCategorySummaryAsync();

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Count > 0);
            
            // Check that percentages are calculated correctly
            var totalPercentage = result.Sum(c => c.Percentage);
            Assert.True(Math.Abs(100 - totalPercentage) < 0.01m);
        }
    }
}
