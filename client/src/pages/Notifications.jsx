import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiBell, FiMail, FiSend } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);

  const sendReminders = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/notifications/send-reminders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResults(response.data);
      toast.success(`Reminders sent to ${response.data.totalSent} employees!`);
    } catch (error) {
      toast.error('Failed to send reminders');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2><FiBell /> Notifications & Reminders</h2>
      </div>

      <div className="notification-card">
        <div className="card-icon">
          <FiMail size={48} />
        </div>
        <h3>Send Task Reminders</h3>
        <p>Send email reminders to all employees with pending or in-progress tasks</p>
        
        <button 
          className="btn-send-reminders" 
          onClick={sendReminders}
          disabled={sending}
        >
          <FiSend /> {sending ? 'Sending...' : 'Send Reminders to All Employees'}
        </button>

        {results && (
          <div className="results-section">
            <h4>Results:</h4>
            <div className="results-summary">
              <div className="result-stat">
                <strong>{results.totalSent}</strong>
                <span>Emails Sent</span>
              </div>
              <div className="result-stat">
                <strong>{results.results.length}</strong>
                <span>Employees Notified</span>
              </div>
            </div>
            
            <div className="results-list">
              {results.results.map((result, idx) => (
                <div key={idx} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <span className="user-name">{result.user}</span>
                  <span className={`status ${result.success ? 'success' : 'error'}`}>
                    {result.success ? '✓ Sent' : '✗ Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>About Notifications</h3>
        <ul>
          <li>Reminders are sent to employees who have pending or in-progress tasks</li>
          <li>Emails include a summary of all their pending tasks with priorities and due dates</li>
          <li>Only employees with active tasks will receive notifications</li>
          <li>You can send reminders manually or set up automated schedules</li>
        </ul>
      </div>

      <div className="automation-section">
        <h3>Automated Reminders (Coming Soon)</h3>
        <p>Set up automatic daily or weekly reminders for your team</p>
        <div className="automation-options disabled">
          <label>
            <input type="checkbox" disabled />
            Send daily reminders at 9:00 AM
          </label>
          <label>
            <input type="checkbox" disabled />
            Send weekly summary every Monday
          </label>
          <label>
            <input type="checkbox" disabled />
            Send reminders for overdue tasks
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
