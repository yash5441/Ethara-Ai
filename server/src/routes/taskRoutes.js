import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:taskId', getTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
