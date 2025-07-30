using ExpenseTracker.Controllers;
using ExpenseTracker.Models;
using ExpenseTracker.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ExpenseTracker.Tests
{
    public class ExpensesControllerTests
    {
        private readonly Mock<IExpenseService> _mockService;
        private readonly ExpensesController _controller;

        public ExpensesControllerTests()
        {
            _mockService = new Mock<IExpenseService>();
            _controller = new ExpensesController(_mockService.Object);
        }

        [Fact]
        public async Task GetExpenses_ReturnsOkResultWithExpenses()
        {
            // Arrange
            var expenses = new List<Expense>
            {
                new Expense { Id = Guid.NewGuid(), Amount = 10.0m, Category = "Food", Description = "Lunch" },
                new Expense { Id = Guid.NewGuid(), Amount = 20.0m, Category = "Transport", Description = "Bus fare" }
            };
            _mockService.Setup(s => s.GetAllExpensesAsync()).ReturnsAsync(expenses);

            // Act
            var result = await _controller.GetExpenses();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Expense>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetExpense_WithValidId_ReturnsOkResultWithExpense()
        {
            // Arrange
            var expenseId = Guid.NewGuid();
            var expense = new Expense { Id = expenseId, Amount = 10.0m, Category = "Food", Description = "Lunch" };
            _mockService.Setup(s => s.GetExpenseByIdAsync(expenseId)).ReturnsAsync(expense);

            // Act
            var result = await _controller.GetExpense(expenseId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<Expense>(okResult.Value);
            Assert.Equal(expenseId, returnValue.Id);
        }

        [Fact]
        public async Task GetExpense_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var expenseId = Guid.NewGuid();
            _mockService.Setup(s => s.GetExpenseByIdAsync(expenseId)).ReturnsAsync((Expense)null);

            // Act
            var result = await _controller.GetExpense(expenseId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateExpense_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var expenseDto = new CreateExpenseDto
            {
                Amount = 10.0m,
                Category = "Food",
                Description = "Lunch"
            };
            var expense = new Expense
            {
                Id = Guid.NewGuid(),
                Amount = expenseDto.Amount,
                Category = expenseDto.Category,
                Description = expenseDto.Description
            };
            _mockService.Setup(s => s.AddExpenseAsync(expenseDto)).ReturnsAsync(expense);

            // Act
            var result = await _controller.CreateExpense(expenseDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(ExpensesController.GetExpense), createdAtActionResult.ActionName);
            Assert.Equal(expense.Id, createdAtActionResult.RouteValues["id"]);
            var returnValue = Assert.IsType<Expense>(createdAtActionResult.Value);
            Assert.Equal(expense.Id, returnValue.Id);
        }

        [Fact]
        public async Task DeleteExpense_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var expenseId = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteExpenseAsync(expenseId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteExpense(expenseId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteExpense_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var expenseId = Guid.NewGuid();
            _mockService.Setup(s => s.DeleteExpenseAsync(expenseId)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteExpense(expenseId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetExpensesByFilter_ReturnsOkResultWithFilteredExpenses()
        {
            // Arrange
            var filter = new ExpenseFilterDto { Category = "Food" };
            var expenses = new List<Expense>
            {
                new Expense { Id = Guid.NewGuid(), Amount = 10.0m, Category = "Food", Description = "Lunch" }
            };
            _mockService.Setup(s => s.GetExpensesByFilterAsync(filter)).ReturnsAsync(expenses);

            // Act
            var result = await _controller.GetExpensesByFilter(filter);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Expense>>(okResult.Value);
            Assert.Single(returnValue);
            Assert.Equal("Food", returnValue[0].Category);
        }

        [Fact]
        public async Task GetCurrentMonthSummary_ReturnsOkResultWithSummary()
        {
            // Arrange
            var summary = new ExpenseSummary
            {
                TotalAmount = 100.0m,
                TotalExpenses = 5,
                StartDate = DateTime.Now.AddDays(-10),
                EndDate = DateTime.Now,
                CategoryTotals = new Dictionary<string, decimal>
                {
                    { "Food", 50.0m },
                    { "Transport", 50.0m }
                }
            };
            _mockService.Setup(s => s.GetCurrentMonthSummaryAsync()).ReturnsAsync(summary);

            // Act
            var result = await _controller.GetCurrentMonthSummary();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<ExpenseSummary>(okResult.Value);
            Assert.Equal(100.0m, returnValue.TotalAmount);
            Assert.Equal(5, returnValue.TotalExpenses);
            Assert.Equal(2, returnValue.CategoryTotals.Count);
        }

        [Fact]
        public async Task GetCategorySummary_ReturnsOkResultWithCategorySummaries()
        {
            // Arrange
            var categorySummaries = new List<CategorySummary>
            {
                new CategorySummary { Category = "Food", Amount = 50.0m, Percentage = 50.0m },
                new CategorySummary { Category = "Transport", Amount = 50.0m, Percentage = 50.0m }
            };
            _mockService.Setup(s => s.GetCategorySummaryAsync()).ReturnsAsync(categorySummaries);

            // Act
            var result = await _controller.GetCategorySummary();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<CategorySummary>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal(50.0m, returnValue[0].Percentage);
            Assert.Equal(50.0m, returnValue[1].Percentage);
        }

        [Fact]
        public async Task GetSummaryByDateRange_ReturnsOkResultWithSummary()
        {
            // Arrange
            var startDate = DateTime.Now.AddDays(-10);
            var endDate = DateTime.Now;
            var summary = new ExpenseSummary
            {
                TotalAmount = 100.0m,
                TotalExpenses = 5,
                StartDate = startDate,
                EndDate = endDate,
                CategoryTotals = new Dictionary<string, decimal>
                {
                    { "Food", 50.0m },
                    { "Transport", 50.0m }
                }
            };
            _mockService.Setup(s => s.GetSummaryByDateRangeAsync(startDate, endDate)).ReturnsAsync(summary);

            // Act
            var result = await _controller.GetSummaryByDateRange(startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<ExpenseSummary>(okResult.Value);
            Assert.Equal(100.0m, returnValue.TotalAmount);
            Assert.Equal(startDate, returnValue.StartDate);
            Assert.Equal(endDate, returnValue.EndDate);
        }

        [Fact]
        public void GetCategories_ReturnsOkResultWithCategories()
        {
            // Act
            var result = _controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<string>>(okResult.Value);
            Assert.Contains("Food", returnValue);
            Assert.Contains("Transport", returnValue);
            Assert.Contains("Entertainment", returnValue);
            Assert.Contains("Shopping", returnValue);
            Assert.Contains("Bills", returnValue);
        }
    }
}
