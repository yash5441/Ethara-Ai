import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/AuthForms';
import '../styles/auth-page.css';

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
