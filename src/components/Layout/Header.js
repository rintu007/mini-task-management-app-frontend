import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCenter from '../Notifications/NotificationCenter';
import './Layout.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();

  return (
    <header className="header">
      <div className="header-left">
        <h1>Task Management</h1>
      </div>
      <div className="header-right">
        <NotificationCenter notifications={notifications} />
        <div className="user-info">
          <span>Welcome, {user?.username} ({user?.role})</span>
          <button onClick={logout} className="btn btn-sm btn-outline">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;