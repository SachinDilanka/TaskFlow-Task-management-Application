import { Task } from '../models/Task.js';

// @desc    Get all tasks (Filtered based on role rules)
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('creator', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find()
        .populate('creator', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let initialAssignment = null;

    if (req.user.role === 'admin') {
      initialAssignment = assignedTo || null;
    } else {
      if (assignedTo && assignedTo !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Normal users can only assign tasks to themselves',
        });
      }
      initialAssignment = assignedTo ? req.user._id : null;
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      creator: req.user._id,
      assignedTo: initialAssignment,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details / status / assignment
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, assignedTo } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    if (assignedTo !== undefined) {
      if (req.user.role === 'admin') {
        task.assignedTo = assignedTo;
      } else {
        if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            message: 'You cannot reassign a task assigned to someone else',
          });
        }
        if (assignedTo && assignedTo !== req.user._id.toString()) {
          return res.status(403).json({
            message: 'Normal users can only assign unassigned tasks to themselves',
          });
        }
        task.assignedTo = assignedTo ? req.user._id : null;
      }
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      req.user.role !== 'admin' &&
      task.creator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};