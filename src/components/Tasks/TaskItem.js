import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Tasks.css';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status
  });
  const { user } = useAuth();

  const canEdit = user.role === 'manager' || 
                 (user.role === 'member' && task.assigned_to === user.id);

  const canDelete = user.role === 'manager' && task.created_by === user.id;

  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(task.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="task-item card">
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            className="form-input"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="form-input"
            rows="3"
          />
          <div className="task-actions">
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h3>{task.title}</h3>
            <div className="task-meta">
              <span className={`status status-${task.status}`}>
                {task.status}
              </span>
              {canEdit && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={() => onDelete(task.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <p>{task.description}</p>
          <div className="task-details">
            <span>Project: {task.Project?.name}</span>
            <span>Assigned to: {task.assignee?.username}</span>
            <span>Created by: {task.creator?.username}</span>
          </div>
          {canEdit && task.status !== 'done' && (
            <div className="task-status-actions">
              <button 
                onClick={() => handleStatusChange('inprogress')}
                className="btn btn-sm btn-primary"
                disabled={task.status === 'inprogress'}
              >
                Start Progress
              </button>
              <button 
                onClick={() => handleStatusChange('done')}
                className="btn btn-sm btn-success"
              >
                Mark Complete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskItem;