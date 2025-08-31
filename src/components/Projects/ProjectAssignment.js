// components/Projects/ProjectAssignment.js
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ProjectAssignment.css';

const ProjectAssignment = ({ project }) => {
  const [availableManagers, setAvailableManagers] = useState([]);
  const [assignedManagers, setAssignedManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAvailableManagers();
    fetchAssignedManagers();
  }, [project]);

  const fetchAvailableManagers = async () => {
    try {
      const response = await api.get(`/projects/${project.id}/available-managers`);
      setAvailableManagers(response.data);
    } catch (error) {
      console.error('Failed to fetch available managers', error);
    }
  };

  const fetchAssignedManagers = async () => {
    try {
      // Get project with assignments
      const response = await api.get(`/projects/${project.id}`);
      setAssignedManagers(response.data.ProjectAssignments || []);
    } catch (error) {
      console.error('Failed to fetch assigned managers', error);
    }
  };

  const assignManager = async () => {
    if (!selectedManager) return;
    
    setLoading(true);
    try {
      await api.post(`/projects/${project.id}/assign-manager`, {
        userId: selectedManager
      });
      
      setSelectedManager('');
      fetchAvailableManagers();
      fetchAssignedManagers();
    } catch (error) {
      console.error('Failed to assign manager', error);
      alert(error.response?.data?.message || 'Failed to assign manager');
    } finally {
      setLoading(false);
    }
  };

  const removeManager = async (userId) => {
    setLoading(true);
    try {
      await api.delete(`/projects/${project.id}/remove-manager/${userId}`);
      fetchAvailableManagers();
      fetchAssignedManagers();
    } catch (error) {
      console.error('Failed to remove manager', error);
      alert(error.response?.data?.message || 'Failed to remove manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-assignment">
      <h3>Manage Project Managers</h3>
      
      <div className="assignment-form">
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          disabled={loading || availableManagers.length === 0}
        >
          <option value="">Select a manager</option>
          {availableManagers.map(manager => (
            <option key={manager.id} value={manager.id}>
              {manager.username}
            </option>
          ))}
        </select>
        
        <button 
          onClick={assignManager}
          disabled={!selectedManager || loading}
          className="btn btn-primary"
        >
          {loading ? 'Assigning...' : 'Assign Manager'}
        </button>
      </div>
      
      <div className="assigned-managers">
        <h4>Assigned Managers</h4>
        {assignedManagers.length === 0 ? (
          <p>No managers assigned to this project</p>
        ) : (
          <ul>
            {assignedManagers.map(assignment => (
              <li key={assignment.id} className="assigned-manager">
                <span>{assignment.User.username}</span>
                {user.role === 'admin' && (
                  <button
                    onClick={() => removeManager(assignment.User.id)}
                    disabled={loading}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectAssignment;