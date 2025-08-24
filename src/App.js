import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import MemberDashboard from './components/Dashboard/MemberDashboard';
import ProjectList from './components/Projects/ProjectList';
import TaskList from './components/Tasks/TaskList';
import UserList from './components/Users/UserList';
import AuditLog from './components/Audit/AuditLog';
import './App.css';

// Helper component to render dashboard based on role
function RoleBasedDashboard() {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'member':
      return <MemberDashboard />;
    default:
      return <div>Loading...</div>;
  }
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="app-loading">Loading application...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<RoleBasedDashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="users" element={<UserList />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <div className="App">
              <AppContent />
            </div>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;