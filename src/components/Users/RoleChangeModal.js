import React, { useState } from 'react';
import './Users.css';

const RoleChangeModal = ({ user, onClose, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRoleChange(selectedRole);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Role for {user.username}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Select New Role</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Change Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleChangeModal;