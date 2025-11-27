import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiBarChart2, FiDownload } from 'react-icons/fi';
import './Reports.css';

const Reports = () => {
  const [dailyStats, setDailyStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchReportStats();
  }, []);

  const fetchReportStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [dailyRes, weeklyRes] = await Promise.all([
        axios.get('https://tms-bj16.onrender.com/api/notifications/report-stats?period=daily', config),
        axios.get('https://tms-bj16.onrender.com/api/notifications/report-stats?period=weekly', config)
      ]);

      setDailyStats(dailyRes.data);
      setWeeklyStats(weeklyRes.data);
    } catch (error) {
      toast.error('Failed to fetch report statistics');
    } finally {
      setLoading(false);
    }
  };

  const sendDailyReport = async () => {
    setSendingEmail(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://tms-bj16.onrender.com/api/notifications/daily-report',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Daily report sent to your email!');
    } catch (error) {
      toast.error('Failed to send daily report');
    } finally {
      setSendingEmail(false);
    }
  };

  const sendWeeklyReport = async () => {
    setSendingEmail(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://tms-bj16.onrender.com/api/notifications/weekly-report',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Weekly report sent to your email!');
    } catch (error) {
      toast.error('Failed to send weekly report');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return <div className="reports-container"><p>Loading reports...</p></div>;
  }

  return (
    <div className="reports-container">
      <div className="page-header">
        <h2><FiBarChart2 /> Reports & Analytics</h2>
      </div>

      <div className="reports-grid">
        {/* Daily Report */}
        <div className="report-card">
          <div className="report-header">
            <h3>Daily Report</h3>
            <button 
              className="btn-email" 
              onClick={sendDailyReport}
              disabled={sendingEmail}
            >
              <FiMail /> Email Report
            </button>
          </div>
          
          {dailyStats && (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{dailyStats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-item pending">
                <div className="stat-value">{dailyStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-item in-progress">
                <div className="stat-value">{dailyStats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-item completed">
                <div className="stat-value">{dailyStats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item overdue">
                <div className="stat-value">{dailyStats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Report */}
        <div className="report-card">
          <div className="report-header">
            <h3>Weekly Report</h3>
            <button 
              className="btn-email" 
              onClick={sendWeeklyReport}
              disabled={sendingEmail}
            >
              <FiMail /> Email Report
            </button>
          </div>
          
          {weeklyStats && (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{weeklyStats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-item completed">
                <div className="stat-value">{weeklyStats.completedThisWeek}</div>
                <div className="stat-label">Completed This Week</div>
              </div>
              <div className="stat-item pending">
                <div className="stat-value">{weeklyStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{weeklyStats.totalHours}h</div>
                <div className="stat-label">Hours Worked</div>
              </div>
              <div className="stat-item productivity">
                <div className="stat-value">{weeklyStats.productivity}%</div>
                <div className="stat-label">Productivity</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>About Reports</h3>
        <ul>
          <li>Daily reports show your current task status and overdue tasks</li>
          <li>Weekly reports include completed tasks, hours worked, and productivity metrics</li>
          <li>Click "Email Report" to receive the report in your registered email</li>
          <li>Reports are automatically calculated based on your assigned tasks</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
