import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { signup, login, getMe, getUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/users', authMiddleware, adminOnly, getUsers);

export default router;
