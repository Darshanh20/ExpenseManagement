// Minimal Express server entrypoint for ExpenseManagement
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./src/config');

const authRouter = require('./src/routes/auth');
const expensesRouter = require('./src/routes/expenses');
const adminRouter = require('./src/routes/admin');
const managerRouter = require('./src/routes/manager');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = config.port || 3000;

app.use(express.json());

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manager', managerRouter);

app.get('/', (req, res) => {
  res.json({ message: 'ExpenseManagement server running' });
});

// Error handler (last middleware)
app.use(errorHandler);

// Connect to MongoDB then start server
const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017/expense_management';
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
