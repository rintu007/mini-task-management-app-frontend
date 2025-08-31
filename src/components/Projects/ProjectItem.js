import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Projects.css';
import { Link } from 'react-router-dom';
import ProjectAssignment from './ProjectAssignment';


const ProjectItem = ({ project, onDelete }) => {
  const [showAssignment, setShowAssignment] = useState(false);
  const { user } = useAuth();

  const canDelete = user.role === 'admin' || 
                   (user.role === 'manager' && project.created_by === user.id);

  return (
    <div className="project-item card">
      <div className="project-header">
        <h3><Link to={`/projects/${project.id}/tasks`} className="project-link">
            {project.name}
          </Link>
        </h3>
        <div className="project-actions">
          {user.role === 'admin' && (
            <button 
              onClick={() => setShowAssignment(!showAssignment)}
              className="btn btn-secondary btn-sm"
            >
              {showAssignment ? 'Hide Managers' : 'Manage Managers'}
            </button>
          )}
          {canDelete && (
            <button 
              onClick={() => onDelete(project.id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p>{project.description}</p>
      <div className="project-meta">
        <span>Created by: {project.creator?.username}</span>
        <span>Managers: {project.ProjectAssignments?.length + 1}</span>

        <span>
          <Link to={`/projects/${project.id}/tasks`} className="tasks-link">
            Tasks: {project.taskCount || 0}
          </Link>
          </span>
      </div>
      {showAssignment && user.role === 'admin' && (
        <ProjectAssignment project={project} />
      )}
    </div>
  );
};

export default ProjectItem;