import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/tasks" className={isActive('/tasks')}>
              Tasks
            </Link>
          </li>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <li>
              <Link to="/projects" className={isActive('/projects')}>
                Projects
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <>
              <li>
                <Link to="/users" className={isActive('/users')}>
                  Users
                </Link>
              </li>
              <li>
                <Link to="/audit" className={isActive('/audit')}>
                  Audit Log
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;