import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle, XCircle, Users } from 'lucide-react';
import Card from '../common/Card';
import AnimatedButton from '../common/AnimatedButton';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('approvals');

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    approvalId: null,
    comments: '',
  });

  useEffect(() => {
    console.log('ManagerDashboard - Current user:', user);
    if (!user) return;
    
    if (activeTab === 'approvals') {
      fetchApprovals();
    } else if (activeTab === 'employees') {
      fetchEmployees();
    }
  }, [activeTab, user]);

  const fetchApprovals = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching approvals...');
      const response = await api.get('/api/manager/approvals');
      console.log('Approvals response:', response.data);
      if (response.data && response.data.expenses) {
        setApprovals(response.data.expenses);
      } else if (Array.isArray(response.data)) {
        setApprovals(response.data);
      } else {
        setApprovals([]);
        console.warn('Unexpected approvals data format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError('Failed to load pending approvals: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching employees...');
      const response = await api.get('/api/manager/employees');
      console.log('Employees response:', response.data);
      if (response.data && response.data.employees) {
        setEmployees(response.data.employees);
      } else if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setEmployees([]);
        console.warn('Unexpected employees data format:', response.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvalId) => {
    try {
      await api.put(`/api/manager/approvals/${approvalId}`, {
        status: 'approved',
      });
      setSuccess('Expense approved successfully!');
      setApprovals(approvals.filter(a => a._id !== approvalId));
    } catch (err) {
      setError('Failed to approve expense');
    }
  };

  const openRejectModal = (approvalId) => {
    setRejectModal({
      isOpen: true,
      approvalId,
      comments: '',
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      isOpen: false,
      approvalId: null,
      comments: '',
    });
  };

  const handleReject = async () => {
    if (!rejectModal.comments.trim()) {
      setError('Please provide rejection comments');
      return;
    }

    try {
      await api.put(`/api/manager/approvals/${rejectModal.approvalId}`, {
        status: 'rejected',
        comments: rejectModal.comments,
      });
      setSuccess('Expense rejected');
      setApprovals(approvals.filter(a => a._id !== rejectModal.approvalId));
      closeRejectModal();
    } catch (err) {
      setError('Failed to reject expense');
    }
  };

  const handleRejectCommentChange = (e) => {
    setRejectModal({
      ...rejectModal,
      comments: e.target.value,
    });
  };

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
        Manager Dashboard
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

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-md flex items-center space-x-2 ${activeTab === 'approvals' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
        >
          <ClipboardList size={16} />
          <span>Pending Approvals</span>
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-md flex items-center space-x-2 ${activeTab === 'employees' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
        >
          <Users size={16} />
          <span>My Employees</span>
        </button>
      </div>

      {activeTab === 'approvals' && (
        <div>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                <ClipboardList className="mr-2" />
                Pending Approvals
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : approvals.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>No pending approvals</p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {approvals.map((approval) => (
                      <motion.div
                        key={approval._id}
                        variants={itemVariants}
                        exit="exit"
                        className="border dark:border-slate-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-slate-200">
                              {approval.description}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Submitted by: {approval.employee.firstName} {approval.employee.lastName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              ${approval.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(approval.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                              {approval.category}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <AnimatedButton
                              onClick={() => handleApprove(approval._id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </AnimatedButton>
                            <AnimatedButton
                              onClick={() => openRejectModal(approval._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              size="sm"
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </AnimatedButton>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'employees' && (
        <div>
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                <Users className="mr-2" />
                My Employees
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>No employees assigned to you</p>
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
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {employees.map((employee) => (
                          <motion.tr key={employee._id} variants={itemVariants}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {employee.firstName} {employee.lastName}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {employee.email}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {employee.role === 'EMPLOYEE' ? 'Employee' : employee.role}
                              </div>
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
        </div>
      )}

      <Modal
        isOpen={rejectModal.isOpen}
        onClose={closeRejectModal}
        title="Reject Expense"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Rejection Comments
            </label>
            <textarea
              value={rejectModal.comments}
              onChange={handleRejectCommentChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200"
              rows="3"
              placeholder="Please provide a reason for rejection"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <AnimatedButton
              onClick={closeRejectModal}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Expense
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
