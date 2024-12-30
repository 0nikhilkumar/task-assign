import { Task } from "../models/task.model.js";

export const getAllTasks = async (req, res) => {
  try {
    const { search, status, sort, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status === 'completed' || status === 'pending') {
      query.status = status === 'completed';
    }

    const sortOptions = {};
    if (sort === 'title') {
      sortOptions.title = 1;
    } else if (sort === 'createdAt') {
      sortOptions.created_at = -1;
    } else if (sort === 'status') {
      sortOptions.status = -1;
    }

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const createTask = async (req, res) => {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
    });
  
    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
}


export const updateTask = async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
      if (task) {
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status !== undefined ? req.body.status : task.status;
        const updatedTask = await task.save();
        res.json(updatedTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }


export const deleteTask = async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (task) {
        res.json({ message: 'Task deleted' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }