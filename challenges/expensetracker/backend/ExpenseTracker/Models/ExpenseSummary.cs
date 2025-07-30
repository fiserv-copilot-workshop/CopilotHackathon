using System;
using System.Collections.Generic;

namespace ExpenseTracker.Models
{
    public class ExpenseSummary
    {
        public decimal TotalAmount { get; set; }
        public int TotalExpenses { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Dictionary<string, decimal> CategoryTotals { get; set; }
    }

    public class CategorySummary
    {
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
    }
}
