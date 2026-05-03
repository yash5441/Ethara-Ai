import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Navbar } from '../components/Navbar';
import { ProjectCard, ProjectForm } from '../components/ProjectComponents';
import { Button, Alert, Spinner } from '../components/UI';
import '../styles/projects-page.css';
import '../styles/drawer.css';

export const ProjectsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { updateProjectList } = useProject();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
      updateProjectList(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data) => {
    try {
      const response = await projectService.createProject(data);
      setProjects([...projects, response.data]);
      updateProjectList([...projects, response.data]);
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleEditProject = async (data) => {
    try {
      const response = await projectService.updateProject(editingProject.id, data);
      setProjects(projects.map(p => p.id === editingProject.id ? response.data : p));
      updateProjectList(projects.map(p => p.id === editingProject.id ? response.data : p));
      setEditingProject(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      updateProjectList(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`);
  };

  const getProjectAccess = (project) => {
    const isOwner = project.members.some(m => m.userId === user?.id && m.role === 'owner');
    const isAdmin = user?.role === 'admin';
    return { isOwner, isAdmin };
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="projects-container">
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="projects-container">
        <div className="projects-header">
          <h1>My Projects</h1>
          <Button onClick={() => setShowForm(true)}>+ New Project</Button>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map(project => {
              const { isOwner, isAdmin } = getProjectAccess(project);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectClick={handleProjectClick}
                  onEdit={(proj) => setEditingProject(proj)}
                  onDelete={handleDeleteProject}
                  isOwner={isOwner}
                  isAdmin={isAdmin}
                />
              );
            })
          ) : (
            <div className="empty-state">
              <p>No projects yet. Create one to get started!</p>
            </div>
          )}
        </div>

        <ProjectForm
          isOpen={showForm || !!editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSubmit={editingProject ? handleEditProject : handleCreateProject}
          initialProject={editingProject}
        />
      </div>
    </>
  );
};
