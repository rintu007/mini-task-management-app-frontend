import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Projects.css';

const ProjectItem = ({ project, onDelete }) => {
  const { user } = useAuth()
  const canDelete = user.role === 'admin' || 
                   (user.role === 'manager' && project.created_by === user.id);

  return (
    <div className="project-item card">
      <div className="project-header">
        <h3>{project.name}</h3>
        {canDelete && (
          <button 
            onClick={() => onDelete(project.id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        )}
      </div>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>Created by: {project.creator?.username}</span>
        <span>Tasks: {project.taskCount || 0}</span>
      </div>
    </div>
  );
};

export default ProjectItem;