import React, { useState } from 'react';
import { Button, Modal, Input, Select, Badge, Alert } from './UI';
import { formatDistanceToNow } from 'date-fns';
import '../styles/task.css';

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

export const TaskCard = ({ task, onTaskClick, projectMembers }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const fallbackAssignee = projectMembers?.find(member => member.userId === task.assignedTo);
  const assignedToName = task.assignedToName || fallbackAssignee?.userName || fallbackAssignee?.userId;

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`} onClick={() => onTaskClick(task)}>
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

export const TaskForm = ({ isOpen, onClose, onSubmit, projectMembers, editingTask }) => {
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
