import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users')
};

export const projectService = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  updateProject: (projectId, data) => api.put(`/projects/${projectId}`, data),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members`, { userId }),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`)
};

export const taskService = {
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  getTask: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
  updateTask: (projectId, taskId, data) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  deleteTask: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`)
};
