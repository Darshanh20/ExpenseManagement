const bcrypt = require('bcrypt');
const { User, Company } = require('../models');
const { generateToken } = require('../utils/jwt');

async function signupCompanyAndAdmin(req, res, next) {
  try {
    const { companyName, currency, email, password, firstName, lastName } = req.body;
    if (!companyName || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if company with this name already exists
    const existingCompany = await Company.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // Create the new company
    const company = await Company.create({ 
      name: companyName,
      currency: currency || 'USD'
    });

    // Create the admin user for this company
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: 'ADMIN', // Automatically make them admin of their company
      company: company._id,
    });

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ 
      message: 'Company and admin account created successfully',
      user: userObj, 
      token,
      company: {
        id: company._id,
        name: company.name,
        currency: company.currency
      }
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
}

async function signupEmployee(req, res, next) {
  try {
    const { email, password, firstName, lastName, role = 'EMPLOYEE', managerId } = req.body;
    const adminUser = req.user; // From auth middleware

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Validate role
    if (!['EMPLOYEE', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be EMPLOYEE or MANAGER' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // Create the employee user for the admin's company
    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role,
      company: adminUser.company, // Same company as admin
      manager: managerId || null, // Optional manager assignment
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ 
      message: 'Employee account created successfully',
      user: userObj
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signupCompanyAndAdmin, loginUser, signupEmployee };
