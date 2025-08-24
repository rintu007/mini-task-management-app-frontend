import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TaskList from '../Tasks/TaskList';
import ProjectList from '../Projects/ProjectList';
import './Dashboard.css';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);
      
      const projects = projectsRes.data;
      const tasks = tasksRes.data;
      
      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'done').length
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Projects</h3>
          <div className="stat-number">{stats.totalProjects}</div>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="stat-number">{stats.totalTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <div className="stat-number">{stats.completedTasks}</div>
        </div>
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>My Projects</h3>
          <ProjectList limit={5} />
        </div>
        
        <div className="widget">
          <h3>Recent Tasks</h3>
          <TaskList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;