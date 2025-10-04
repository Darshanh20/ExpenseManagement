const bcrypt = require('bcrypt');
const { User } = require('../models');
const { signupEmployee } = require('./authController');

// Get all users in the admin's company
async function getUsers(req, res, next) {
  try {
    const admin = req.user;
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    const users = await User.find({ company: admin.company })
      .select('-password')
      .populate('manager', 'firstName lastName email')
      .populate('company', 'name currency')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Admin creates a user (EMPLOYEE or MANAGER) within their company
async function createUser(req, res, next) {
  try {
    const admin = req.user; // protect middleware should attach admin
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    const { email, password, firstName, lastName, role, managerId } = req.body;
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['EMPLOYEE', 'MANAGER'].includes(role.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid role. Must be EMPLOYEE or MANAGER' });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // If managerId is provided, validate that the manager exists and belongs to the same company
    if (managerId) {
      const manager = await User.findOne({ 
        _id: managerId, 
        company: admin.company,
        role: 'MANAGER'
      });
      if (!manager) {
        return res.status(400).json({ message: 'Invalid manager selected' });
      }
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: role.toUpperCase(),
      company: admin.company,
      manager: managerId || null, // Optional manager assignment
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ 
      message: 'User created successfully',
      user: userObj 
    });
  } catch (err) {
    next(err);
  }
}

// Admin assigns a manager to an employee
async function assignManager(req, res, next) {
  try {
    const admin = req.user;
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    const { userId, managerId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // Find the employee
    const employee = await User.findOne({ 
      _id: userId, 
      company: admin.company,
      role: 'EMPLOYEE'
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found in your company' });

    // If managerId is provided, validate the manager
    if (managerId) {
      const manager = await User.findOne({ 
        _id: managerId, 
        company: admin.company,
        role: 'MANAGER'
      });
      if (!manager) return res.status(400).json({ message: 'Invalid manager selected' });
    }

    // Update the employee's manager
    employee.manager = managerId || null;
    await employee.save();

    const empObj = employee.toObject();
    delete empObj.password;

    res.json({ 
      message: 'Manager assigned successfully',
      user: empObj 
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, createUser, assignManager };
