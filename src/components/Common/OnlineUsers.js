import React from 'react';
import { useSocket } from '../../context/SocketContext';
import './Common.css';

const OnlineUsers = () => {
  const { onlineUsers } = useSocket();

  return (
    <div className="online-users">
      <h3>Online Users ({onlineUsers.length})</h3>
      {onlineUsers.length === 0 ? (
        <p>No users online</p>
      ) : (
        <ul>
          {onlineUsers.map(user => (
            <li key={user.id} className="online-user">
              <span className="user-name">{user.username}</span>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnlineUsers;