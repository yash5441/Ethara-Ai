import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Alert } from './UI';
import '../styles/auth.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login to TMS</h2>
      {error && <Alert type="error">{error}</Alert>}

      <Input
        type="email"
        placeholder="Email address"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <p className="auth-link">
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>

      <div className="demo-info">
        <p><strong>Demo Accounts:</strong></p>
        <p>Admin: admin@atlas.local / Admin123!</p>
        <p>Member: lena@atlas.local / Member123!</p>
      </div>
    </form>
  );
};

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(name, email, password, confirmPassword);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      {error && <Alert type="error">{error}</Alert>}

      <Input
        type="text"
        placeholder="Full name"
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        type="email"
        placeholder="Email address"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password (min 8 chars)"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Confirm password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="auth-link">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </form>
  );
};
