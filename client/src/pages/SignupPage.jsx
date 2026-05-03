import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignupForm } from '../components/AuthForms';
import '../styles/auth-page.css';

export const SignupPage = () => {
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
          <SignupForm />
        </div>
      </div>
    </div>
  );
};
