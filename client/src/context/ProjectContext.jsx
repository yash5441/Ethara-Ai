import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const updateProjectList = (projectList) => {
    setProjects(projectList);
  };

  const updateTaskList = (taskList) => {
    setTasks(taskList);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      tasks,
      setCurrentProject,
      addProject,
      updateProjectList,
      updateTaskList
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
