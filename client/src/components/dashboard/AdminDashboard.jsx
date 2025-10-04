import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Building2, Crown, UserCheck } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import AnimatedButton from '../common/AnimatedButton';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import api from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    managerId: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/admin/users', formData);
      setSuccess('User created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'employee',
        managerId: '',
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignManager = async (userId, managerId) => {
    try {
      await api.put('/api/admin/users/assign-manager', { userId, managerId });
      setSuccess('Manager assigned successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to assign manager');
    }
  };

  const managers = users.filter(u => u.role === 'MANAGER');
  const employees = users.filter(u => u.role === 'EMPLOYEE');
  const admins = users.filter(u => u.role === 'ADMIN');

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'MANAGER':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'EMPLOYEE':
        return <Users className="w-4 h-4 text-green-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'MANAGER':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'EMPLOYEE':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage users and organizational structure
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{users.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Employees</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{employees.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Managers</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{managers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg"
        >
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg"
        >
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </motion.div>
      )}

      {/* Add User Button */}
      <div className="mb-8">
        <AnimatedButton 
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <UserPlus size={20} />
          <span>Add New User</span>
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Users List */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              All Users ({users.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-12">
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
              No users yet. Create your first user!
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 max-h-96 overflow-y-auto"
            >
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  variants={itemVariants}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-200">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {user.manager && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Manager: {user.manager.firstName} {user.manager.lastName}
                    </div>
                  )}

                  {user.role === 'EMPLOYEE' && (
                    <div className="mt-3">
                      <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Assign Manager
                      </label>
                      <select
                        value={user.manager?._id || ''}
                        onChange={(e) => handleAssignManager(user._id, e.target.value)}
                        className="w-full text-sm px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-200"
                      >
                        <option value="">No manager</option>
                        {managers.map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.firstName} {manager.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </Card>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@company.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {formData.role === 'employee' && managers.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Assign Manager (Optional)
              </label>
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <AnimatedButton
              type="button"
              variant="secondary"
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : 'Create User'}
            </AnimatedButton>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;