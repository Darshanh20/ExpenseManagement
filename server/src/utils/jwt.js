const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const token = jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
  return token;
}

module.exports = { generateToken };
