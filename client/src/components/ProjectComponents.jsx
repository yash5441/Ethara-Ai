import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Alert } from './UI';
import { projectService, authService } from '../services/index';
import '../styles/project.css';

export const ProjectCard = ({ project, onProjectClick, onEdit, onDelete, isOwner, isAdmin }) => {
  const taskCount = project.taskCount || 0;
  const memberCount = project.members?.length || 0;
  const [showMenu, setShowMenu] = useState(false);
  const canManage = isOwner || isAdmin;

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit && onEdit(project);
    setShowMenu(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this project and all its tasks?')) {
      onDelete && onDelete(project.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="project-card" onClick={() => onProjectClick(project)}>
      <div className="project-header">
        <div>
          <h3>{project.name}</h3>
          <span className="member-badge">{memberCount} members</span>
        </div>
        {canManage && (
          <div className="project-card-menu">
            <button
              className="menu-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleEditClick} className="menu-item edit">Edit</button>
                <button onClick={handleDeleteClick} className="menu-item delete">Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="project-desc">{project.description || 'No description'}</p>
      <div className="project-stats">
        <div className="stat">
          <span className="stat-value">{taskCount}</span>
          <span className="stat-label">Tasks</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectForm = ({ isOpen, onClose, onSubmit, initialProject = null }) => {
  const [name, setName] = useState(initialProject?.name || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialProject?.name || '');
      setDescription(initialProject?.description || '');
      setError('');
    }
  }, [isOpen, initialProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ name, description });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialProject ? 'Edit Project' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="form">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          type="text"
          placeholder="Project name"
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="text"
          placeholder="Project description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (initialProject ? 'Saving...' : 'Creating...') : (initialProject ? 'Save Changes' : 'Create Project')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const AddMemberForm = ({ isOpen, onClose, onSubmit, currentMembers }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await authService.getUsers();
      const availableUsers = response.data.filter(
        u => !currentMembers.some(m => m.userId === u.id)
      );
      setUsers(availableUsers);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(selectedUser);
      setSelectedUser('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="form">
        {error && <Alert type="error">{error}</Alert>}

        <Select
          label="Select User"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          options={users}
          required
        />

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !selectedUser}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
