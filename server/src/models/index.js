// Models index - define and export data models here

// Example placeholder model
class Expense {
  constructor({ id, amount, description, date }) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.date = date || new Date();
  }
}

// Export models. Real Mongoose models will be added here as files.
const Company = require('./company');
const User = require('./user');
const ExpenseModel = require('./expense');

module.exports = { Expense, Company, User, Expense: ExpenseModel };
