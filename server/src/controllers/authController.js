const bcrypt = require('bcrypt');
const { User, Company } = require('../models');
const { generateToken } = require('../utils/jwt');

async function signupCompanyAndAdmin(req, res, next) {
  try {
    // Check if any company exists
    const existing = await Company.findOne();
    if (existing) {
      return res.status(400).json({ message: 'A company already exists' });
    }

    const { companyName, email, password, firstName, lastName } = req.body;
    if (!companyName || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const company = await Company.create({ name: companyName });

    const user = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      role: 'ADMIN',
      company: company._id,
    });

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
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

module.exports = { signupCompanyAndAdmin, loginUser };
