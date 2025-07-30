using ExpenseTracker.Models;
using ExpenseTracker.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            var expenses = await _expenseService.GetAllExpensesAsync();
            return Ok(expenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpense(Guid id)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);

            if (expense == null)
            {
                return NotFound();
            }

            return Ok(expense);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesByFilter([FromQuery] ExpenseFilterDto filter)
        {
            var expenses = await _expenseService.GetExpensesByFilterAsync(filter);
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense(CreateExpenseDto expenseDto)
        {
            var expense = await _expenseService.AddExpenseAsync(expenseDto);
            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id)
        {
            var result = await _expenseService.DeleteExpenseAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("summary/month")]
        public async Task<ActionResult<ExpenseSummary>> GetCurrentMonthSummary()
        {
            var summary = await _expenseService.GetCurrentMonthSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("summary/categories")]
        public async Task<ActionResult<IEnumerable<CategorySummary>>> GetCategorySummary()
        {
            var summary = await _expenseService.GetCategorySummaryAsync();
            return Ok(summary);
        }

        [HttpGet("summary/daterange")]
        public async Task<ActionResult<ExpenseSummary>> GetSummaryByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var summary = await _expenseService.GetSummaryByDateRangeAsync(startDate, endDate);
            return Ok(summary);
        }

        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetCategories()
        {
            return Ok(ExpenseCategories.Categories);
        }
    }
}
