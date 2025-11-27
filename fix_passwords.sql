-- ============================================
-- FIX USER PASSWORDS
-- Run this to update existing user passwords
-- ============================================

USE task_management;

-- Update admin password (admin123)
UPDATE Users 
SET password = '$2a$10$.lQ/bVnsQCrXekvQdnm6IuuYL1YBakVAPTIz.uhVYP777AeTZU31y'
WHERE username = 'admin';

-- Update all employee passwords (emp123)
UPDATE Users 
SET password = '$2a$10$TScsOcgi5KEunseFsI8clOlLabek0Lx0BA0oFXxMQFb0R4atMPLFK'
WHERE role = 'employee';

-- Verify the update
SELECT username, email, role, isActive, 
       SUBSTRING(password, 1, 20) as password_hash
FROM Users;

-- ============================================
-- DONE! Now you can login with:
-- admin / admin123
-- Any employee / emp123
-- ============================================
