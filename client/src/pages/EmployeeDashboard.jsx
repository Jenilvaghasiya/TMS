import React, { useState, useEffect } from 'react';
import { taskAPI, dashboardAPI } from '../services/api';
import { FiCheckSquare, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResponse, statsResponse] = await Promise.all([
        taskAPI.getMyTasks(),
        dashboardAPI.getEmployeeStats()
      ]);
      setTasks(tasksResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = stats?.pendingTasks || 0;
  const inProgressTasks = stats?.inProgressTasks || 0;
  const completedTasks = stats?.completedTasks || 0;
  const overdueTasks = stats?.overdueTasks || 0;

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: <FiCheckSquare />, color: '#4f46e5' },
    { title: 'Pending', value: pendingTasks, icon: <FiClock />, color: '#f59e0b' },
    { title: 'In Progress', value: inProgressTasks, icon: <FiClock />, color: '#3b82f6' },
    { title: 'Overdue', value: overdueTasks, icon: <FiAlertCircle />, color: '#ef4444' }
  ];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h2 className="page-title">My Dashboard</h2>
      
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

      <div className="recent-tasks">
        <h3>High Priority & Upcoming Tasks</h3>
        <div className="task-list">
          {tasks
            .filter(t => t.priority === 'High' || t.priority === 'Urgent' || t.status !== 'Completed')
            .slice(0, 5)
            .map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')} | Priority: {task.priority}</p>
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

export default EmployeeDashboard;
