import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Navbar } from '../components/Navbar';
import { Button, Alert, Spinner } from '../components/UI';
import '../styles/dashboard.css';

export const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { updateProjectList, updateTaskList } = useProject();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const projectsResponse = await projectService.getProjects();
      setProjects(projectsResponse.data);
      updateProjectList(projectsResponse.data);

      // Fetch all tasks from all projects
      let allTasks = [];
      for (const project of projectsResponse.data) {
        const tasksResponse = await taskService.getTasks(project.id);
        allTasks = [...allTasks, ...tasksResponse.data];
      }
      setTasks(allTasks);
      updateTaskList(allTasks);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <Spinner />
        </div>
      </>
    );
  }

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };
  };

  const stats = getTaskStats();
  const completionRate = tasks.length > 0 ? Math.round((stats.completed / tasks.length) * 100) : 0;

  const recentTasks = tasks.slice(-5).reverse();
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Here's your project overview</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3>{projects.length}</h3>
              <p>Active Projects</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed Tasks</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.overdue}</h3>
              <p>Overdue Tasks</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>📊 Completion Progress</h2>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
            <p className="progress-text">{completionRate}% Complete</p>
          </div>

          <div className="dashboard-card">
            <h2>📋 Recent Tasks</h2>
            {recentTasks.length > 0 ? (
              <ul className="task-list">
                {recentTasks.map(task => (
                  <li key={task.id} className={`task-item ${task.status}`}>
                    <span className="task-title">{task.title}</span>
                    <span className={`task-status ${task.status}`}>{task.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks yet</p>
            )}
          </div>
        </div>

        {overdueTasks.length > 0 && (
          <div className="dashboard-card">
            <h2>⚠️ Overdue Tasks</h2>
            <ul className="task-list">
              {overdueTasks.map(task => (
                <li key={task.id} className="task-item overdue">
                  <span className="task-title">{task.title}</span>
                  <span className="task-priority">{task.priority}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="dashboard-actions">
          <Button onClick={() => navigate('/projects')}>View All Projects</Button>
        </div>
      </div>
    </>
  );
};
