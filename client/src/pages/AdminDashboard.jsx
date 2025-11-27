import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { FiCheckSquare, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: <FiCheckSquare />, color: '#4f46e5' },
    { title: 'Pending', value: stats?.pendingTasks || 0, icon: <FiClock />, color: '#f59e0b' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: <FiCheckSquare />, color: '#10b981' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: <FiAlertCircle />, color: '#ef4444' }
  ];

  return (
    <div className="dashboard">
      <h2 className="page-title">Admin Dashboard</h2>
      
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: card.color }}>
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Employee Productivity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.employeeProductivity || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fullName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalTasks" fill="#4f46e5" name="Total Tasks" />
              <Bar dataKey="completedTasks" fill="#10b981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-tasks">
        <h3>Recent Tasks</h3>
        <div className="task-list">
          {stats?.recentTasks?.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <h4>{task.title}</h4>
                <p>Created by: {task.creator?.fullName}</p>
              </div>
              <span className={`status-badge ${task.status.toLowerCase()}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
