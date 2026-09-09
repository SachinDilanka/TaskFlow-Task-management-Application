import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireAdmin, getUsers);

export default router;