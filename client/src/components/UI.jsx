import React from 'react';
import '../styles/components.css';

export const Button = ({ children, variant = 'primary', size = 'md', disabled = false, ...props }) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className={`form-input ${error ? 'error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className={`form-input ${error ? 'error' : ''}`} {...props}>
        <option value="">Select an option</option>
        {options.map(opt => (
          <option key={opt.id || opt} value={opt.id || opt}>
            {opt.name || opt}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const Badge = ({ children, variant = 'default' }) => {
  return <span className={`badge badge-${variant}`}>{children}</span>;
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </>
  );
};

export const Alert = ({ type = 'info', children }) => {
  return <div className={`alert alert-${type}`}>{children}</div>;
};

export const Spinner = () => {
  return <div className="spinner"></div>;
};
