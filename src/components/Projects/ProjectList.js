// components/Projects/ProjectList.js
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ProjectItem from './ProjectItem';
import ProjectForm from './ProjectForm';
import './Projects.css';

const ProjectList = ({ limit }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user, logout } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchProjects();
    
    // Listen for project assignment events
    if (socket) {
      socket.on('manager-assigned', handleManagerAssigned);
      socket.on('manager-removed', handleManagerRemoved);
      
      return () => {
        socket.off('manager-assigned', handleManagerAssigned);
        socket.off('manager-removed', handleManagerRemoved);
      };
    }
  }, [socket]);

  const handleManagerAssigned = (data) => {
    // Refresh projects if the current user is the one assigned
    if (data.userId === user.id) {
      fetchProjects();
    }
  };

  const handleManagerRemoved = (data) => {
    // Refresh projects if the current user is the one removed
    if (data.userId === user.id) {
      fetchProjects();
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      let projectsData = response.data;
      
      if (limit) {
        projectsData = projectsData.slice(0, limit);
      }
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      setProjects([response.data, ...projects]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="project-list">
      <div className="project-header">
        <h2>Projects</h2>
        {(user.role === 'admin' || user.role === 'manager') && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create Project
          </button>
        )}
      </div>
      
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="projects">
          {projects.map(project => (
            <ProjectItem 
              key={project.id} 
              project={project} 
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
      
      {showForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;