import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Audit.css';

const AuditLog = ({ limit }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get('/audit');
      let logsData = response.data;
      
      if (limit) {
        logsData = logsData.slice(0, limit);
      }
      
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="audit-log">
      <h2>Audit Log</h2>
      
      {logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="logs">
          {logs.map(log => (
            <div key={log.id} className="log-item">
              <div className="log-action">{log.action}</div>
              <div className="log-description">{log.description}</div>
              <div className="log-meta">
                <span>By: {log.User?.username}</span>
                <span>At: {formatDate(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLog;