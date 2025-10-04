const bcrypt = require('bcrypt');
const { User } = require('../models');

// Admin creates a user (EMPLOYEE or MANAGER) within their company
async function createUser(req, res, next) {
  try {
    const admin = req.user; // protect middleware should attach admin
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['EMPLOYEE', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role,
      company: admin.company,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj });
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

    const { employeeId, managerId } = req.body;
    if (!employeeId || !managerId) return res.status(400).json({ message: 'Missing ids' });

    // Ensure both exist and belong to the same company as admin
    const employee = await User.findOne({ _id: employeeId, company: admin.company });
    const manager = await User.findOne({ _id: managerId, company: admin.company });
    if (!employee || !manager) return res.status(404).json({ message: 'Employee or manager not found in your company' });

    employee.manager = manager._id;
    await employee.save();

    const empObj = employee.toObject();
    delete empObj.password;

    res.json({ user: empObj });
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, assignManager };
