-- Task Management System Database Setup
-- Run this script to create the database and initial admin user

-- Create database
CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

-- Note: Tables will be created automatically by Sequelize when you start the server

-- Create initial admin user (password: admin123)
-- Run this AFTER starting the server for the first time
INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
VALUES (
  'admin',
  'admin@example.com',
  '$2a$10$.lQ/bVnsQCrXekvQdnm6IuuYL1YBakVAPTIz.uhVYP777AeTZU31y',
  'System Administrator',
  'admin',
  1,
  NOW(),
  NOW()
);

-- Create sample employee user (password: emp123)
INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
VALUES (
  'employee',
  'employee@example.com',
  '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK',
  'John Employee',
  'employee',
  1,
  NOW(),
  NOW()
);

-- Sample task data (optional)
INSERT INTO Tasks (title, description, priority, status, dueDate, createdBy, createdAt, updatedAt)
VALUES (
  'Complete Project Documentation',
  'Write comprehensive documentation for the task management system',
  'High',
  'Pending',
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  1,
  NOW(),
  NOW()
);

-- Sample courier entry (optional)
INSERT INTO Couriers (senderName, receiverName, courierType, trackingNumber, status, receivedDate, createdBy, createdAt, updatedAt)
VALUES (
  'ABC Company',
  'John Doe',
  'FedEx',
  'FDX123456789',
  'Received',
  NOW(),
  1,
  NOW(),
  NOW()
);
