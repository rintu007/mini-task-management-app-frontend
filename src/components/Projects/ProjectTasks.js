import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TaskItem from '../Tasks/TaskItem';
import TaskForm from '../Tasks/TaskForm';

const ProjectTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { projectId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post(`/tasks`, taskData);
      setTasks([...tasks, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-tasks">
      <div className="header">
        <h2>{project?.name} - Tasks</h2>
        {(user.role === 'manager') && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found for this project.</p>
      ) : (
        <div className="tasks-list">
          {tasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          projectId={projectId}
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectTasks;