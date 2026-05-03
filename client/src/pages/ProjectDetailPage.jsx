import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { projectService, taskService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { TaskCard, TaskForm } from '../components/TaskComponents';
import { AddMemberForm } from '../components/ProjectComponents';
import { Button, Alert, Spinner, Badge } from '../components/UI';
import '../styles/project-detail.css';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProjectData();
  }, [isAuthenticated, projectId]);

  const fetchProjectData = async () => {
    try {
      const projectResponse = await projectService.getProject(projectId);
      setProject(projectResponse.data);

      const tasksResponse = await taskService.getTasks(projectId);
      setTasks(tasksResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      const response = await taskService.createTask(projectId, data);
      setTasks([...tasks, response.data]);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      const response = await taskService.updateTask(projectId, editingTask.id, data);
      setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t));
      setEditingTask(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await taskService.deleteTask(projectId, taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const response = await projectService.addMember(projectId, userId);
      setProject(response.data);
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveMember = async (member) => {
    const memberLabel = member.userName || member.userEmail || member.userId;

    if (!window.confirm(`Remove ${memberLabel} from this project?`)) {
      return;
    }

    try {
      const response = await projectService.removeMember(projectId, member.userId);
      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove member');
    }
  };

  const isOwner = project?.members.some(m => m.userId === user?.id && m.role === 'owner');
  const isMember = project?.members.some(m => m.userId === user?.id);
  const isAdmin = user?.role === 'admin';

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const timelineTasks = [...tasks]
    .filter(task => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="project-detail-container">
          <Spinner />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="project-detail-container">
          <Alert type="error">{error || 'Project not found'}</Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="project-detail-container">
        <div className="project-header">
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          <div className="project-actions">
            {(isOwner || isAdmin) && (
              <Button onClick={() => setShowMemberForm(true)}>+ Add Member</Button>
            )}
            <Button onClick={() => setShowTaskForm(true)}>+ New Task</Button>
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="project-info">
          <div className="info-box">
            <h3>Team Members ({project.members.length})</h3>
            <ul className="members-list">
              {project.members.map(member => (
                <li key={member.userId}>
                  <div className="member-details">
                    <span className="member-name">{member.userName || member.userEmail || member.userId}</span>
                    <Badge variant={member.role === 'owner' ? 'warning' : 'default'}>
                      {member.role}
                    </Badge>
                  </div>
                  {(isOwner || isAdmin) && member.role !== 'owner' && (
                    <button
                      type="button"
                      className="remove-member-btn"
                      onClick={() => handleRemoveMember(member)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-box">
            <h3>Task Overview</h3>
            <ul className="stats-list">
              <li>Total: {tasks.length}</li>
              <li>✅ Completed: {tasks.filter(t => t.status === 'completed').length}</li>
              <li>⚡ In Progress: {tasks.filter(t => t.status === 'in-progress').length}</li>
              <li>⏳ Pending: {tasks.filter(t => t.status === 'pending').length}</li>
              <li>⚠️ Overdue: {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length}</li>
            </ul>
          </div>

          <div className="info-box">
            <h3>Task Timeline</h3>
            {timelineTasks.length > 0 ? (
              <ul className="timeline-list">
                {timelineTasks.map(task => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

                  return (
                    <li key={task.id} className={`timeline-item ${isOverdue ? 'overdue' : ''}`}>
                      <div className="timeline-main">
                        <strong>{task.title}</strong>
                        <span>{task.assignedToName || 'Unassigned'}</span>
                      </div>
                      <div className="timeline-meta">
                        <Badge variant={isOverdue ? 'error' : 'default'}>
                          {isOverdue ? 'Overdue' : task.status}
                        </Badge>
                        <span>
                          {task.dueDate
                            ? `${format(new Date(task.dueDate), 'MMM d, yyyy')} · ${formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}`
                            : 'No due date'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="empty-message">Add due dates to tasks to build a timeline.</p>
            )}
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="tasks-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="task-wrapper">
                  <TaskCard
                    task={task}
                    onTaskClick={() => setEditingTask(task)}
                    projectMembers={project.members}
                  />
                  {isOwner && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-message">No tasks in this category</p>
            )}
          </div>
        </div>

        <TaskForm
          isOpen={showTaskForm || !!editingTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          projectMembers={project.members}
          editingTask={editingTask}
        />

        <AddMemberForm
          isOpen={showMemberForm}
          onClose={() => setShowMemberForm(false)}
          onSubmit={handleAddMember}
          currentMembers={project.members}
        />
      </div>
    </>
  );
};
