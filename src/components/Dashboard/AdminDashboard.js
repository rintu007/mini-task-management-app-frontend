import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectList from '../Projects/ProjectList';
//import UserList from '../Users/UserList';
import AuditLog from '../Audit/AuditLog';
import OnlineUsers from '../Common/OnlineUsers';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      
      <div className="dashboard-actions">
        <Link to="/projects" className="action-button">
          Manage Projects
        </Link>
        <Link to="/users" className="action-button">
          Manage Users
        </Link>
        <Link to="/audit" className="action-button">
          View Audit Log
        </Link>
      </div>
      
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Recent Projects</h3>
          <ProjectList limit={5} />
        </div>
        
        <div className="widget">
          <h3>Online Users</h3>
          <OnlineUsers />
        </div>
        
        <div className="widget">
          <h3>Recent Audit Logs</h3>
          <AuditLog limit={5} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;