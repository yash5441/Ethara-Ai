import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addMember,
  removeMember
} from '../controllers/projectController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:projectId', getProject);
router.put('/:projectId', updateProject);
router.post('/:projectId/members', addMember);
router.delete('/:projectId/members/:userId', removeMember);

export default router;
