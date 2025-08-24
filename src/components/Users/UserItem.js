import React from 'react';
import { useSocket } from '../../context/SocketContext';
import './Users.css';

const UserItem = ({ user, onRoleChange, canChangeRole }) => {
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.some(onlineUser => onlineUser.id === user.id);

  return (
    <div className="user-item card">
      <div className="user-info">
        <div className="user-main">
          <h3>{user.username}</h3>
          <span className={`user-role role-${user.role}`}>{user.role}</span>
          <span className={`user-status ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="user-actions">
          {canChangeRole && (
            <button onClick={onRoleChange} className="btn btn-primary btn-sm">
              Change Role
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserItem;