import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  checkTitleUnique
} from '../controllers/taskController.js';

const router = express.Router();

// Task routes
router.post('/gp', protect, createTask);
router.get('/gp', protect, getTasks);
router.get('/:id/gp', protect, getTaskById);
router.put('/:id/gp', protect, updateTask);
router.delete('/:id/gp', protect, deleteTask);
router.post('/check-title', protect, checkTitleUnique);

export default router; 