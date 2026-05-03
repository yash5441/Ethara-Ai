import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Badge, Alert, Drawer } from './UI';
import { formatDistanceToNow } from 'date-fns';
import '../styles/task.css';
import '../styles/drawer.css';

const statusColors = {
  pending: 'default',
  'in-progress': 'warning',
  completed: 'success',
  'on-hold': 'secondary'
};

const priorityColors = {
  low: 'secondary',
  medium: 'default',
  high: 'warning',
  critical: 'error'
};

export const TaskCard = ({ task, onTaskClick, projectMembers, canEdit = true }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const fallbackAssignee = projectMembers?.find(member => member.userId === task.assignedTo);
  const assignedToName = task.assignedToName || fallbackAssignee?.userName || fallbackAssignee?.userId;

  return (
    <div
      className={`task-card ${isOverdue ? 'overdue' : ''} ${canEdit ? 'clickable' : 'locked'}`}
      onClick={canEdit ? () => onTaskClick(task) : undefined}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <Badge variant={statusColors[task.status]}>{task.status}</Badge>
      </div>

      <p className="task-desc">{task.description || 'No description'}</p>

      <div className="task-meta">
        <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>

        {assignedToName && (
          <div className="task-assignee">👤 {assignedToName}</div>
        )}

        {task.dueDate && (
          <div className={`task-due ${isOverdue ? 'overdue-text' : ''}`}>
            📅 {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskDetailDrawer = ({ isOpen, onClose, task, onSave, projectMembers, canEdit, isAdmin, isOwner }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'pending');
  const [dueDate, setDueDate] = useState(task?.dueDate?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setAssignedTo(task.assignedTo || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'pending');
      setDueDate(task.dueDate?.split('T')[0] || '');
      setError('');
    }
  }, [isOpen, task]);

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      await onSave({
        title,
        description,
        assignedTo: assignedTo || null,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }

    setLoading(false);
  };

  const canEditPriority = isAdmin || isOwner;
  const canReassign = isAdmin || isOwner;
  const isAssignee = task?.assignedTo === assignedTo;
  const canEditStatus = canEdit || isAssignee;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Task Details" width="500px">
      <div className="drawer-content">
        {error && <Alert type="error">{error}</Alert>}

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canEdit}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!canEditStatus}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={!canEditPriority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              className="form-input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={!canReassign}
            >
              <option value="">Unassigned</option>
              {projectMembers.map(m => (
                <option key={m.userId} value={m.userId}>
                  {m.userName || m.userEmail || m.userId}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>

        <div className="drawer-actions">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {canEdit && (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export const TaskForm = ({ isOpen, onSubmit, onClose, editingTask, projectMembers }) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [assignedTo, setAssignedTo] = useState(editingTask?.assignedTo || '');
  const [priority, setPriority] = useState(editingTask?.priority || 'medium');
  const [status, setStatus] = useState(editingTask?.status || 'pending');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate?.split('T')[0] || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        title,
        description,
        assignedTo: assignedTo || null,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });

      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingTask ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="form">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          type="text"
          placeholder="Task title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          type="text"
          placeholder="Task description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Assign To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          options={projectMembers.map(m => ({ id: m.userId, name: m.userName }))}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={['low', 'medium', 'high', 'critical']}
        />

        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={['pending', 'in-progress', 'completed', 'on-hold']}
        />

        <Input
          type="date"
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
