import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js';

import { Router } from 'express';

const router = Router();

router.route('/').get(authenticateToken, getAllTasks);
router.route('/').post(authenticateToken, createTask);
router.route('/:id').put(authenticateToken, updateTask);
router.route('/:id').delete(authenticateToken, deleteTask);


export default router;