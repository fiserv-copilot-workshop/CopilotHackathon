using System.Collections.Generic;

namespace ExpenseTracker.Models
{
    public static class ExpenseCategories
    {
        public static readonly List<string> Categories = new List<string>
        {
            "Food",
            "Transport",
            "Entertainment",
            "Shopping",
            "Bills",
            "Other"
        };
    }
}
