import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { FiHome, FiCheckSquare, FiUsers, FiPackage, FiLogOut, FiMenu, FiX, FiBarChart2, FiBell } from 'react-icons/fi';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/tasks', icon: <FiCheckSquare />, label: 'Tasks' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/couriers', icon: <FiPackage />, label: 'Couriers' },
    { path: '/admin/notifications', icon: <FiBell />, label: 'Notifications' }
  ];

  const employeeLinks = [
    { path: '/employee/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/employee/my-tasks', icon: <FiCheckSquare />, label: 'My Tasks' },
    { path: '/employee/couriers', icon: <FiPackage />, label: 'Couriers' },
    { path: '/employee/reports', icon: <FiBarChart2 />, label: 'Reports' }
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>TaskFlow</h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.icon}
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>Welcome, {user?.fullName}</h1>
          <div className="user-badge">{user?.role}</div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
