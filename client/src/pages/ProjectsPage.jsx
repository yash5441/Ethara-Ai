import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Navbar } from '../components/Navbar';
import { ProjectCard, ProjectForm } from '../components/ProjectComponents';
import { Button, Alert, Spinner } from '../components/UI';
import '../styles/projects-page.css';

export const ProjectsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { updateProjectList } = useProject();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

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
    } catch (err) {
      throw err;
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`);
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
            projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectClick={handleProjectClick}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No projects yet. Create one to get started!</p>
            </div>
          )}
        </div>

        <ProjectForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </>
  );
};
