import { db } from '../utils/db.js';

export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(member => member.userId === req.user.userId);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }

    if (assignedTo && !project.members.some(member => member.userId === assignedTo)) {
      return res.status(400).json({ error: 'Assigned user is not a project member' });
    }

    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      projectId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      status: 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.tasks.push(task);
    await db.write();

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(member => member.userId === req.user.userId);
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }

    const tasks = db.data.tasks.filter(task => task.projectId === projectId).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(member => member.userId === req.user.userId);
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }

    const task = db.data.tasks.find(item => item.id === taskId && item.projectId === projectId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(member => member.userId === req.user.userId);
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }

    const task = db.data.tasks.find(t => t.id === taskId && t.projectId === projectId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
    
    task.updatedAt = new Date().toISOString();

    await db.write();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

    const project = db.data.projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(m => m.userId === req.user.userId);
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isAdmin) {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }

    const taskIndex = db.data.tasks.findIndex(item => item.id === taskId && item.projectId === projectId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.data.tasks.splice(taskIndex, 1);
    await db.write();

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
