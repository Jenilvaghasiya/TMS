-- ============================================
-- DUMMY DATA FOR TASK MANAGEMENT SYSTEM
-- Run this after the server has created tables
-- ============================================

USE task_management;

-- Clear existing data (optional - comment out if you want to keep existing data)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE TaskUpdates;
TRUNCATE TABLE TaskAssignments;
TRUNCATE TABLE Tasks;
TRUNCATE TABLE Couriers;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERT USERS (Admin + Employees)
-- ============================================

-- Admin user (password: admin123)
INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
VALUES 
('admin', 'admin@company.com', '$2a$10$.lQ/bVnsQCrXekvQdnm6IuuYL1YBakVAPTIz.uhVYP777AeTZU31y', 'System Administrator', 'admin', 1, NOW(), NOW());

-- Employee users (password: emp123 for all)
INSERT INTO Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
VALUES 
('john.doe', 'john.doe@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'John Doe', 'employee', 1, NOW(), NOW()),
('jane.smith', 'jane.smith@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'Jane Smith', 'employee', 1, NOW(), NOW()),
('mike.johnson', 'mike.johnson@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'Mike Johnson', 'employee', 1, NOW(), NOW()),
('sarah.williams', 'sarah.williams@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'Sarah Williams', 'employee', 1, NOW(), NOW()),
('david.brown', 'david.brown@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'David Brown', 'employee', 1, NOW(), NOW()),
('emily.davis', 'emily.davis@company.com', '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK', 'Emily Davis', 'employee', 1, NOW(), NOW());

-- ============================================
-- INSERT TASKS
-- ============================================

INSERT INTO Tasks (title, description, priority, status, dueDate, createdBy, createdAt, updatedAt)
VALUES 
-- Urgent Tasks
('Fix Critical Production Bug', 'Database connection timeout issue affecting all users. Needs immediate attention.', 'Urgent', 'In-Progress', DATE_ADD(NOW(), INTERVAL 1 DAY), 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('Security Patch Implementation', 'Apply latest security patches to all servers before deadline.', 'Urgent', 'Pending', DATE_ADD(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- High Priority Tasks
('Complete Q4 Financial Report', 'Prepare comprehensive financial analysis and projections for Q4 2024.', 'High', 'In-Progress', DATE_ADD(NOW(), INTERVAL 5 DAY), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
('Client Presentation Preparation', 'Create PowerPoint presentation for ABC Corp client meeting next week.', 'High', 'Pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('Update Employee Handbook', 'Revise company policies and update employee handbook with new regulations.', 'High', 'Completed', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Medium Priority Tasks
('Website Redesign Phase 2', 'Implement new UI/UX design for customer portal and dashboard.', 'Medium', 'In-Progress', DATE_ADD(NOW(), INTERVAL 14 DAY), 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('Inventory Management System', 'Develop automated inventory tracking system for warehouse operations.', 'Medium', 'Pending', DATE_ADD(NOW(), INTERVAL 21 DAY), 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('Marketing Campaign Analysis', 'Analyze results from recent social media marketing campaigns.', 'Medium', 'Completed', DATE_SUB(NOW(), INTERVAL 1 DAY), 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Team Training Session', 'Organize and conduct training on new project management tools.', 'Medium', 'Pending', DATE_ADD(NOW(), INTERVAL 10 DAY), 1, NOW(), NOW()),

-- Low Priority Tasks
('Office Supply Inventory', 'Count and order office supplies for next quarter.', 'Low', 'Pending', DATE_ADD(NOW(), INTERVAL 30 DAY), 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('Update Documentation', 'Review and update technical documentation for internal systems.', 'Low', 'In-Progress', DATE_ADD(NOW(), INTERVAL 20 DAY), 1, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
('Social Media Content Calendar', 'Plan social media posts for next month.', 'Low', 'Completed', DATE_SUB(NOW(), INTERVAL 3 DAY), 1, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- Overdue Tasks
('Monthly Newsletter', 'Create and send monthly company newsletter to all employees.', 'Medium', 'Pending', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
('Server Backup Verification', 'Verify all server backups are working correctly.', 'High', 'Pending', DATE_SUB(NOW(), INTERVAL 1 DAY), 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- ============================================
-- INSERT TASK ASSIGNMENTS
-- ============================================

-- Task 1: Fix Critical Production Bug (Assigned to John and Mike)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES 
(1, 2, NOW(), NOW()),
(1, 4, NOW(), NOW());

-- Task 2: Security Patch (Assigned to David)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (2, 6, NOW(), NOW());

-- Task 3: Q4 Financial Report (Assigned to Jane)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (3, 3, NOW(), NOW());

-- Task 4: Client Presentation (Assigned to Sarah and Emily)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES 
(4, 5, NOW(), NOW()),
(4, 7, NOW(), NOW());

-- Task 5: Employee Handbook (Assigned to Jane - Completed)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (5, 3, NOW(), NOW());

-- Task 6: Website Redesign (Assigned to John and Emily)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES 
(6, 2, NOW(), NOW()),
(6, 7, NOW(), NOW());

-- Task 7: Inventory System (Assigned to Mike)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (7, 4, NOW(), NOW());

-- Task 8: Marketing Analysis (Assigned to Sarah - Completed)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (8, 5, NOW(), NOW());

-- Task 9: Training Session (Assigned to David)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (9, 6, NOW(), NOW());

-- Task 10: Office Supply (Assigned to Emily)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (10, 7, NOW(), NOW());

-- Task 11: Documentation (Assigned to John)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (11, 2, NOW(), NOW());

-- Task 12: Social Media (Assigned to Sarah - Completed)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (12, 5, NOW(), NOW());

-- Task 13: Newsletter (Assigned to Jane - Overdue)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (13, 3, NOW(), NOW());

-- Task 14: Server Backup (Assigned to David - Overdue)
INSERT INTO TaskAssignments (taskId, userId, createdAt, updatedAt)
VALUES (14, 6, NOW(), NOW());

-- ============================================
-- INSERT TASK UPDATES (Work Logs)
-- ============================================

-- Updates for Task 1 (Critical Bug)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(1, 2, 'Started investigating the database connection timeout issue. Checked server logs.', 'In-Progress', 2.5, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 4, 'Found the root cause - connection pool exhaustion. Working on fix.', 'In-Progress', 3.0, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Updates for Task 3 (Financial Report)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(3, 3, 'Gathered all financial data from accounting department.', 'In-Progress', 4.0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 3, 'Created initial draft of Q4 report. Need to add projections.', 'In-Progress', 5.5, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Updates for Task 5 (Employee Handbook - Completed)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(5, 3, 'Reviewed all policy changes with HR department.', 'In-Progress', 3.0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 3, 'Updated handbook with new policies and got approval.', 'Completed', 4.5, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Updates for Task 6 (Website Redesign)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(6, 2, 'Completed mockups for new dashboard design.', 'In-Progress', 6.0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 7, 'Started implementing frontend components using React.', 'In-Progress', 8.0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Updates for Task 8 (Marketing Analysis - Completed)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(8, 5, 'Collected data from all social media platforms.', 'In-Progress', 2.0, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(8, 5, 'Completed analysis report with recommendations.', 'Completed', 5.0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Updates for Task 11 (Documentation)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(11, 2, 'Reviewed existing documentation and identified outdated sections.', 'In-Progress', 3.5, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Updates for Task 12 (Social Media - Completed)
INSERT INTO TaskUpdates (taskId, userId, comment, status, hoursWorked, createdAt, updatedAt)
VALUES 
(12, 5, 'Created content calendar with 30 posts scheduled.', 'Completed', 4.0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- ============================================
-- INSERT COURIER ENTRIES
-- ============================================

INSERT INTO Couriers (senderName, receiverName, courierType, trackingNumber, status, receivedDate, deliveredDate, remarks, createdBy, createdAt, updatedAt)
VALUES 
-- Recent deliveries
('ABC Suppliers Ltd', 'John Doe', 'FedEx', 'FDX123456789', 'Delivered', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Office supplies - printer cartridges', 1, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Tech Solutions Inc', 'IT Department', 'DHL', 'DHL987654321', 'Delivered', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 'Server hardware components', 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Global Marketing Co', 'Sarah Williams', 'UPS', 'UPS456789123', 'Delivered', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 'Marketing materials and brochures', 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),

-- Pending deliveries
('Office Depot', 'Admin Department', 'FedEx', 'FDX789456123', 'Received', DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'Stationery items - urgent', 1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('Dell Technologies', 'Mike Johnson', 'DHL', 'DHL321654987', 'Received', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'Laptop for new employee', 1, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('Amazon Business', 'Emily Davis', 'Amazon Logistics', 'AMZ789123456', 'Received', NOW(), NULL, 'Office furniture - desk and chair', 1, NOW(), NOW()),

-- More historical data
('Staples Inc', 'Reception', 'UPS', 'UPS147258369', 'Delivered', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY), 'Paper and filing supplies', 1, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
('HP Enterprise', 'IT Department', 'FedEx', 'FDX963852741', 'Delivered', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY), 'Network switches and cables', 1, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
('Microsoft Store', 'David Brown', 'DHL', 'DHL852963741', 'Delivered', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY), 'Software licenses', 1, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY)),
('Legal Documents Co', 'Admin', 'FedEx Priority', 'FDX741852963', 'Received', DATE_SUB(NOW(), INTERVAL 3 DAY), NULL, 'Confidential legal documents', 1, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- Today's entries
('Quick Print Services', 'Marketing Team', 'Local Courier', 'LOCAL123456', 'Received', NOW(), NULL, 'Business cards for all employees', 1, NOW(), NOW()),
('Catering Services', 'HR Department', 'Self Delivery', 'NONE', 'Received', NOW(), NULL, 'Lunch for team meeting', 1, NOW(), NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted data
SELECT 'Users Created:' as Info, COUNT(*) as Count FROM Users
UNION ALL
SELECT 'Tasks Created:', COUNT(*) FROM Tasks
UNION ALL
SELECT 'Task Assignments:', COUNT(*) FROM TaskAssignments
UNION ALL
SELECT 'Task Updates:', COUNT(*) FROM TaskUpdates
UNION ALL
SELECT 'Courier Entries:', COUNT(*) FROM Couriers;

-- Show task distribution
SELECT 
    u.fullName as Employee,
    COUNT(ta.taskId) as TotalTasks,
    SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as Pending,
    SUM(CASE WHEN t.status = 'In-Progress' THEN 1 ELSE 0 END) as InProgress,
    SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as Completed
FROM Users u
LEFT JOIN TaskAssignments ta ON u.id = ta.userId
LEFT JOIN Tasks t ON ta.taskId = t.id
WHERE u.role = 'employee'
GROUP BY u.id, u.fullName
ORDER BY TotalTasks DESC;

-- ============================================
-- DUMMY DATA INSERTION COMPLETE!
-- ============================================
