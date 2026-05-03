import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, projectService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button, Alert, Spinner, Badge } from '../components/UI';
import '../styles/admin.css';

export const AdminPage = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, isAdmin]);

  const fetchAdminData = async () => {
    try {
      const usersResponse = await authService.getUsers();
      setUsers(usersResponse.data);

      const projectsResponse = await projectService.getProjects();
      setProjects(projectsResponse.data);

      // Calculate stats
      setStats({
        totalUsers: usersResponse.data.length,
        admins: usersResponse.data.filter(u => u.role === 'admin').length,
        members: usersResponse.data.filter(u => u.role === 'member').length,
        totalProjects: projectsResponse.data.length
      });
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-container">
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>System overview and management</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-info">
              <h3>{stats.admins}</h3>
              <p>Admin Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{stats.members}</h3>
              <p>Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-info">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-section">
          <h2>Users Management</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td className="user-name">{userItem.name}</td>
                    <td className="user-email">{userItem.email}</td>
                    <td>
                      <Badge variant={userItem.role === 'admin' ? 'warning' : 'default'}>
                        {userItem.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td>-</td>
                    <td>
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Table */}
        <div className="admin-section">
          <h2>Projects Overview</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>
                      {project.members.find(m => m.role === 'owner')?.userName || 'N/A'}
                    </td>
                    <td>{project.members.length}</td>
                    <td>-</td>
                    <td>
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
