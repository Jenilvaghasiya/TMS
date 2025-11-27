const nodemailer = require('nodemailer');

// Lazy transporter creation - only create when needed
let transporter = null;

const getTransporter = () => {
  // Check if email is properly configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    throw new Error('Email service not configured');
  }
  
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });
  }
  return transporter;
};

// Send task reminder email
const sendTaskReminder = async (userEmail, userName, tasks) => {
  try {
    const transporter = getTransporter();
    
    if (!transporter) {
      return { success: false, message: 'Email service not configured' };
    }
    const taskList = tasks.map(task => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${task.title}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${task.priority}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${task.status}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(task.dueDate).toLocaleDateString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Task Reminder - Pending Tasks',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${userName},</h2>
          <p>You have <strong>${tasks.length}</strong> pending task(s) that require your attention:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #4F46E5; color: white;">
                <th style="padding: 10px; border: 1px solid #ddd;">Task</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Priority</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${taskList}
            </tbody>
          </table>
          
          <p>Please log in to the system to update your tasks.</p>
          <a href="https://tms-bj16.onrender.com/login" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Task Management</a>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated reminder. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    if (error.message === 'Email service not configured') {
      console.log('Email service not configured - skipping email');
      return { success: false, message: 'Email service not available' };
    }
    console.error('Email send error:', error.message);
    return { success: false, message: error.message };
  }
};

// Send daily report email
const sendDailyReport = async (userEmail, userName, stats) => {
  try {
    const transporter = getTransporter();
    
    if (!transporter) {
      return { success: false, message: 'Email service not configured' };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Daily Task Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Daily Report - ${new Date().toLocaleDateString()}</h2>
          <p>Hello ${userName},</p>
          <p>Here's your daily task summary:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 15px;">
              <strong>Total Tasks:</strong> ${stats.totalTasks}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Pending:</strong> <span style="color: #f59e0b;">${stats.pending}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>In Progress:</strong> <span style="color: #3b82f6;">${stats.inProgress}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Completed:</strong> <span style="color: #10b981;">${stats.completed}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Overdue:</strong> <span style="color: #ef4444;">${stats.overdue}</span>
            </div>
          </div>
          
          <a href="https://tms-bj16.onrender.com/login" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Tasks</a>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated report. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Report sent successfully' };
  } catch (error) {
    if (error.message === 'Email service not configured') {
      console.log('Email service not configured - skipping email');
      return { success: false, message: 'Email service not available' };
    }
    console.error('Email send error:', error.message);
    return { success: false, message: error.message };
  }
};

// Send weekly report email
const sendWeeklyReport = async (userEmail, userName, stats) => {
  try {
    const transporter = getTransporter();
    
    if (!transporter) {
      return { success: false, message: 'Email service not configured' };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Weekly Task Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Weekly Report - Week of ${new Date().toLocaleDateString()}</h2>
          <p>Hello ${userName},</p>
          <p>Here's your weekly task summary:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 15px;">
              <strong>Total Tasks This Week:</strong> ${stats.totalTasks}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Completed This Week:</strong> <span style="color: #10b981;">${stats.completedThisWeek}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Pending:</strong> <span style="color: #f59e0b;">${stats.pending}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Total Hours Worked:</strong> ${stats.totalHours} hours
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Productivity:</strong> ${stats.productivity}%
            </div>
          </div>
          
          <a href="https://tms-bj16.onrender.com/login" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Tasks</a>
          
          <p style="margin-top: 20px; color: #666; font-size: 12px;">This is an automated report. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Weekly report sent successfully' };
  } catch (error) {
    if (error.message === 'Email service not configured') {
      console.log('Email service not configured - skipping email');
      return { success: false, message: 'Email service not available' };
    }
    console.error('Email send error:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendTaskReminder,
  sendDailyReport,
  sendWeeklyReport
};
