const Task = require('../models/task.model');
const mongoose = require('mongoose');

/* ================= CREATE TASK ================= */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });

  } catch (error) {
    next(error);
  }
};


/* ================= GET ALL TASKS ================= */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    next(error);
  }
};


/* ================= UPDATE TASK ================= */
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Only owner can update
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only task owner can update"
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });

  } catch (error) {
    next(error);
  }
};


/* ================= DELETE TASK ================= */
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Allow only admin to delete
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete tasks"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};