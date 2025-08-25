import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Projects.css';
import { Link } from 'react-router-dom';

const ProjectItem = ({ project, onDelete }) => {
  const { user } = useAuth()
  const canDelete = user.role === 'admin' || 
                   (user.role === 'manager' && project.created_by === user.id);

  return (
    <div className="project-item card">
      <div className="project-header">
        <h3><Link to={`/projects/${project.id}/tasks`} className="project-link">
            {project.name}
          </Link>
        </h3>
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
        <span>
          <Link to={`/projects/${project.id}/tasks`} className="tasks-link">
            Tasks: {project.taskCount || 0}
          </Link>
          </span>
      </div>
    </div>
  );
};

export default ProjectItem;