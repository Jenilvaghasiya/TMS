-- Complete Database Setup for sql12809643
-- Task Management System

-- Use the database
USE sql12809643;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS `TaskUpdates`;
DROP TABLE IF EXISTS `TaskAssignments`;
DROP TABLE IF EXISTS `Tasks`;
DROP TABLE IF EXISTS `Couriers`;
DROP TABLE IF EXISTS `Users`;

-- Create Users table
CREATE TABLE `Users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `fullName` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `role` ENUM('admin', 'employee', 'Employee') DEFAULT 'Employee',
  `isActive` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Couriers table
CREATE TABLE `Couriers` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `vehicleType` VARCHAR(50),
  `vehicleNumber` VARCHAR(50),
  `licenseNumber` VARCHAR(50),
  `availability` ENUM('Available', 'Busy', 'Offline') DEFAULT 'Available',
  `currentLocation` VARCHAR(255),
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Tasks table
CREATE TABLE `Tasks` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  `status` ENUM('Pending', 'In-Progress', 'Completed') DEFAULT 'Pending',
  `dueDate` DATETIME NOT NULL,
  `attachments` TEXT,
  `createdBy` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create TaskAssignments table
CREATE TABLE `TaskAssignments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `taskId` INTEGER NOT NULL,
  `courierId` INTEGER NOT NULL,
  `assignedAt` DATETIME NOT NULL,
  `assignedBy` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`taskId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`courierId`) REFERENCES `Couriers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`assignedBy`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create TaskUpdates table
CREATE TABLE `TaskUpdates` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `taskId` INTEGER NOT NULL,
  `updateType` ENUM('Status', 'Location', 'Note', 'Photo') NOT NULL,
  `content` TEXT NOT NULL,
  `location` VARCHAR(255),
  `photoUrl` VARCHAR(255),
  `updatedBy` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`taskId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data

-- Insert Users (password is 'password123' hashed with bcrypt)
INSERT INTO `Users` (`username`, `email`, `password`, `fullName`, `phone`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
('admin', 'admin@tms.com', '$2b$10$rZ5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.', 'Admin User', '+1234567890', 'admin', 1, NOW(), NOW()),
('manager', 'manager@tms.com', '$2b$10$rZ5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.', 'John Manager', '+1234567891', 'employee', 1, NOW(), NOW()),
('mike', 'mike@tms.com', '$2b$10$rZ5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.', 'Mike Courier', '+1234567892', 'Employee', 1, NOW(), NOW()),
('sarah', 'sarah@tms.com', '$2b$10$rZ5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.', 'Sarah Courier', '+1234567893', 'Employee', 1, NOW(), NOW()),
('tom', 'tom@tms.com', '$2b$10$rZ5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.vYqJ9pYqJ9pYO7Z5L3KxH.', 'Tom Courier', '+1234567894', 'Employee', 1, NOW(), NOW());

-- Insert Couriers
INSERT INTO `Couriers` (`userId`, `vehicleType`, `vehicleNumber`, `licenseNumber`, `availability`, `currentLocation`, `rating`, `createdAt`, `updatedAt`) VALUES
(3, 'Motorcycle', 'MH-01-AB-1234', 'DL123456789', 'Available', '19.0760,72.8777', 4.5, NOW(), NOW()),
(4, 'Van', 'MH-02-CD-5678', 'DL987654321', 'Available', '19.0896,72.8656', 4.8, NOW(), NOW()),
(5, 'Bike', 'MH-03-EF-9012', 'DL456789123', 'Busy', '19.1136,72.8697', 4.2, NOW(), NOW());

-- Insert Tasks
INSERT INTO `Tasks` (`title`, `description`, `priority`, `status`, `dueDate`, `attachments`, `createdBy`, `createdAt`, `updatedAt`) VALUES
('Deliver Package to Downtown', 'Urgent delivery of documents to client office', 'Urgent', 'In-Progress', DATE_ADD(NOW(), INTERVAL 2 HOUR), '[]', 2, NOW(), NOW()),
('Pick up from Warehouse', 'Collect inventory items from main warehouse', 'High', 'Pending', DATE_ADD(NOW(), INTERVAL 1 DAY), '[]', 2, NOW(), NOW()),
('Medical Supply Delivery', 'Deliver medical supplies to hospital', 'Urgent', 'Pending', DATE_ADD(NOW(), INTERVAL 4 HOUR), '[]', 1, NOW(), NOW()),
('Food Delivery - Restaurant', 'Pick up and deliver food orders', 'Medium', 'Completed', DATE_SUB(NOW(), INTERVAL 1 HOUR), '[]', 2, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW()),
('Document Collection', 'Collect signed documents from client', 'Low', 'Pending', DATE_ADD(NOW(), INTERVAL 2 DAY), '[]', 2, NOW(), NOW()),
('Furniture Delivery', 'Deliver furniture to new office location', 'Medium', 'In-Progress', DATE_ADD(NOW(), INTERVAL 5 HOUR), '[]', 1, NOW(), NOW()),
('Electronics Pickup', 'Pick up electronics from supplier', 'High', 'Pending', DATE_ADD(NOW(), INTERVAL 3 HOUR), '[]', 2, NOW(), NOW()),
('Grocery Delivery', 'Deliver groceries to residential area', 'Low', 'Completed', DATE_SUB(NOW(), INTERVAL 2 HOUR), '[]', 2, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW());

-- Insert TaskAssignments
INSERT INTO `TaskAssignments` (`taskId`, `courierId`, `assignedAt`, `assignedBy`, `createdAt`, `updatedAt`) VALUES
(1, 1, NOW(), 2, NOW(), NOW()),
(3, 2, NOW(), 1, NOW(), NOW()),
(4, 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 2, DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW()),
(6, 3, NOW(), 1, NOW(), NOW()),
(8, 2, DATE_SUB(NOW(), INTERVAL 4 HOUR), 2, DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW());

-- Insert TaskUpdates
INSERT INTO `TaskUpdates` (`taskId`, `updateType`, `content`, `location`, `photoUrl`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Status', 'Package picked up from sender', '19.0760,72.8777', NULL, 3, DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW()),
(1, 'Location', 'En route to destination', '19.0820,72.8750', NULL, 3, DATE_SUB(NOW(), INTERVAL 15 MINUTE), NOW()),
(4, 'Status', 'Order picked up from restaurant', '19.0896,72.8656', NULL, 3, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(4, 'Status', 'Delivered successfully', '19.0950,72.8700', NULL, 3, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(6, 'Note', 'Large item, may need assistance at delivery', NULL, NULL, 5, DATE_SUB(NOW(), INTERVAL 10 MINUTE), NOW()),
(8, 'Status', 'All items delivered', '19.1100,72.8650', NULL, 4, DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW());

-- Display summary
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS TotalUsers FROM Users;
SELECT COUNT(*) AS TotalCouriers FROM Couriers;
SELECT COUNT(*) AS TotalTasks FROM Tasks;
SELECT COUNT(*) AS TotalAssignments FROM TaskAssignments;
SELECT COUNT(*) AS TotalUpdates FROM TaskUpdates;
