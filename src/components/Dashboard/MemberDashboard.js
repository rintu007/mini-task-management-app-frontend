import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TaskList from '../Tasks/TaskList';
import './Dashboard.css';

const MemberDashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/assigned-to-me');
      const tasks = response.data;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'done').length,
        inProgressTasks: tasks.filter(task => task.status === 'inprogress').length
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Member Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Assigned Tasks</h3>
          <div className="stat-number">{stats.totalTasks}</div>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-number">{stats.inProgressTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{stats.completedTasks}</div>
        </div>
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>My Tasks</h3>
          <TaskList assignedToMe={true} limit={10} />
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;