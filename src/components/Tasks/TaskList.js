import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './Tasks.css';

const TaskList = ({ assignedToMe, limit }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const endpoint = assignedToMe ? '/tasks/assigned-to-me' : '/tasks';
      const response = await api.get(endpoint);
      let tasksData = response.data;
      
      if (limit) {
        tasksData = tasksData.slice(0, limit);
      }
      
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      <div className="task-header">
        <h2>{assignedToMe ? 'My Tasks' : 'Tasks'}</h2>
        {user.role === 'manager' && !assignedToMe && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create Task
          </button>
        )}
      </div>
      
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="tasks">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
      
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TaskList;