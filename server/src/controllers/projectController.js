import { db } from '../utils/db.js';

const enrichMember = (member) => {
  const user = db.data.users.find(item => item.id === member.userId);

  return {
    ...member,
    userName: user?.name || 'Unknown user',
    userEmail: user?.email || ''
  };
};

const enrichProject = (project) => ({
  ...project,
  members: project.members.map(enrichMember),
  taskCount: db.data.tasks.filter(task => task.projectId === project.id).length
});

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = {
      id: `proj-${Date.now()}`,
      name,
      description: description || '',
      createdBy: req.user.userId,
      members: [
        {
          userId: req.user.userId,
          role: 'owner'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.projects.push(project);
    await db.write();

    res.status(201).json(enrichProject(project));
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'admin';

    let projects = [];

    if (isAdmin) {
      projects = db.data.projects;
    } else {
      projects = db.data.projects.filter(p => 
        p.members.some(m => m.userId === userId)
      );
    }

    res.json(projects.map(enrichProject));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
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

    res.json(enrichProject(project));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isOwner = project.members.some(member => member.userId === req.user.userId && member.role === 'owner');
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only project owner can update' });
    }

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.updatedAt = new Date().toISOString();

    await db.write();

    res.json(enrichProject(project));
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isOwner = project.members.some(member => member.userId === req.user.userId && member.role === 'owner');
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only project owner can add members' });
    }

    const userExists = db.data.users.find(user => user.id === userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyMember = project.members.some(member => member.userId === userId);
    if (alreadyMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    project.members.push({
      userId,
      role: 'member'
    });

    project.updatedAt = new Date().toISOString();
    await db.write();

    res.json(enrichProject(project));
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isOwner = project.members.some(member => member.userId === req.user.userId && member.role === 'owner');
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only project owner can remove members' });
    }

    const memberIndex = project.members.findIndex(member => member.userId === userId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (project.members[memberIndex].role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove owner from project' });
    }

    project.members.splice(memberIndex, 1);
    project.updatedAt = new Date().toISOString();
    await db.write();

    res.json(enrichProject(project));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = db.data.projects.find(item => item.id === projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isOwner = project.members.some(member => member.userId === req.user.userId && member.role === 'owner');
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only project owner can delete projects' });
    }

    db.data.projects = db.data.projects.filter(item => item.id !== projectId);
    db.data.tasks = db.data.tasks.filter(task => task.projectId !== projectId);
    await db.write();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
