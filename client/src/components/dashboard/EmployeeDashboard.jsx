import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Receipt, Clock, CheckCircle, XCircle, FileText, Filter } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import AnimatedButton from '../common/AnimatedButton';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'travel',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [receiptFile, setReceiptFile] = useState(null);

  useEffect(() => {
    console.log('EmployeeDashboard - Current user:', user);
    if (!user) return;
    
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching expenses...');
      const response = await api.get('/api/expenses/my-expenses');
      console.log('Expenses response:', response.data);
      if (response.data && response.data.expenses) {
        setExpenses(response.data.expenses);
      } else if (Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        setExpenses([]);
        console.warn('Unexpected expenses data format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        // Check if the file is a PDF
        if (files[0].type === 'application/pdf') {
          setReceiptFile(files[0]);
          setError('');
        } else {
          setError('Only PDF files are allowed');
          e.target.value = null; // Reset the file input
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('amount', parseFloat(formData.amount));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('date', formData.date);
      
      // Add receipt file if provided
      if (receiptFile) {
        formDataToSend.append('receipt', receiptFile);
      }

      await api.post('/api/expenses', formDataToSend);
      setSuccess('Expense submitted successfully!');
      setShowModal(false);
      setFormData({
          description: '',
          amount: '',
          category: 'travel',
          date: new Date().toISOString().split('T')[0],
        });
      setReceiptFile(null);
      fetchExpenses();
    } catch (err) {
      console.error('Error submitting expense:', err);
      setError(err.response?.data?.message || 'Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: <Clock size={14} />,
        color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        text: 'Pending'
      },
      approved: {
        icon: <CheckCircle size={14} />,
        color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        text: 'Approved'
      },
      rejected: {
        icon: <XCircle size={14} />,
        color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
        text: 'Rejected'
      },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded ${badge.color}`}>
        {badge.icon}
        <span>{badge.text}</span>
      </span>
    );
  };

  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.status === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
        Employee Dashboard
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Expenses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <AnimatedButton
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-1" />
          New Expense
        </AnimatedButton>
      </div>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <FileText className="mr-2" />
            My Expenses
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Receipt className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-2" />
              <p>No expenses found</p>
              {filter !== 'all' && (
                <p className="text-sm mt-1">Try changing your filter</p>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredExpenses.map((expense) => (
                      <motion.tr key={expense._id} variants={itemVariants}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {expense.description}
                            {(expense.receipt || expense.receiptFile) && (
                              <div className="mt-1">
                                {expense.receipt && !expense.receipt.includes('undefined') ? (
                                  <a 
                                    href={expense.receipt} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-xs"
                                  >
                                    <i className="fas fa-link mr-1"></i> View Receipt URL
                                  </a>
                                ) : expense.receiptFile ? (
                                  <a 
                                    href={`/api/expenses/receipt/${expense._id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-xs"
                                  >
                                    <i className="fas fa-file-pdf mr-1"></i> View Receipt PDF
                                  </a>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-slate-800 dark:text-slate-200">
                            ${expense.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {expense.category}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(expense.status)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Submit New Expense"
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of expense"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200"
                  required
                >
                  <option value="travel">Travel</option>
                  <option value="meals">Meals & Entertainment</option>
                  <option value="supplies">Office Supplies</option>
                  <option value="software">Software</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />


            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Upload Receipt PDF (Optional)
              </label>
              <input
                type="file"
                name="receiptFile"
                accept="application/pdf"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200"
              />
              {receiptFile && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  File selected: {receiptFile.name}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <AnimatedButton
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? <Spinner size="sm" /> : 'Submit Expense'}
              </AnimatedButton>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
