import { User } from '../models/User.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};