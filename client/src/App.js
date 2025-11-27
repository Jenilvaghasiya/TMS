import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskManagement from './pages/TaskManagement';
import UserManagement from './pages/UserManagement';
import CourierManagement from './pages/CourierManagement';
import MyTasks from './pages/MyTasks';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/employee/dashboard" />;

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />} />
      
      <Route path="/admin" element={<PrivateRoute adminOnly><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="couriers" element={<CourierManagement />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="/employee" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="couriers" element={<CourierManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
