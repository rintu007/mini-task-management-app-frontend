import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './Notifications.css';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-center">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification ${notification.type || 'info'}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;