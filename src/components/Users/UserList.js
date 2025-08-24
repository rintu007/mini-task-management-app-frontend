import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import UserItem from './UserItem';
import RoleChangeModal from './RoleChangeModal';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeClick = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleRoleChange = async (newRole) => {
    try {
      await api.put(`/users/${selectedUser.id}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to change user role', error);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="user-list">
      <h2>User Management</h2>
      
      <div className="users">
        {users.map(user => (
          <UserItem 
            key={user.id} 
            user={user} 
            onRoleChange={() => handleRoleChangeClick(user)}
            canChangeRole={currentUser.role === 'admin' && user.id !== currentUser.id}
          />
        ))}
      </div>
      
      {showRoleModal && (
        <RoleChangeModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  );
};

export default UserList;