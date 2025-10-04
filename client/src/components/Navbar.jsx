import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import AnimatedButton from './common/AnimatedButton';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-surface-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <DollarSign className="text-indigo-600 dark:text-indigo-400" size={32} />
            </motion.div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
              ExpenseManager
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Hello, <span className="font-medium text-slate-800 dark:text-slate-200">{user?.firstName}</span>
                </span>
                <AnimatedButton
                  onClick={handleLogout}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <AnimatedButton variant="secondary">
                    Login
                  </AnimatedButton>
                </Link>
                <Link to="/signup">
                  <AnimatedButton variant="primary">
                    Sign Up
                  </AnimatedButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
