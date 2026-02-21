const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');

const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

/**
 * Apply authentication middleware to all task routes
 */
router.use(verifyToken);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create new task
 * @access  Private (User)
 */
router.post('/', createTask);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private (User)
 */
router.get('/', getTasks);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get single task by ID
 * @access  Private (User)
 */
router.get('/:id', getTaskById);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task (Owner only)
 * @access  Private (User - Owner)
 */
router.put('/:id', updateTask);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete task
 * @access  Private (Admin only)
 */
router.delete('/:id', allowRoles('admin'), deleteTask);

module.exports = router;