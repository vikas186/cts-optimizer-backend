const bcrypt = require('bcryptjs');
const { User, Organization } = require('../../models');
const { generateToken } = require('../../utils/jwt');

const register = async (userData) => {
  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create a new organization for this user (one org per signup)
  const org = await Organization.create({
    name: `Organization for ${email}`
  });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user linked to the new org
  const user = await User.create({
    email,
    password: hashedPassword,
    organization_id: org.id,
    role: 'user'
  });

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: userResponse,
    token
  };
};

const login = async (email, password) => {
  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: userResponse,
    token
  };
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  register,
  login,
  getMe
};

