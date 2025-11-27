-- Fix Database Schema Issues
USE sql12809643;

-- Option 1: Add username column with default values for existing records
-- First, add the column as nullable
ALTER TABLE `Users` ADD COLUMN `username` VARCHAR(50) NULL;

-- Update existing records to have unique usernames based on email
UPDATE `Users` SET `username` = SUBSTRING_INDEX(`email`, '@', 1) WHERE `username` IS NULL;

-- Now make it NOT NULL and UNIQUE
ALTER TABLE `Users` MODIFY COLUMN `username` VARCHAR(50) NOT NULL;
ALTER TABLE `Users` ADD UNIQUE INDEX `username_unique` (`username`);

-- Fix the role enum to match the model
ALTER TABLE `Users` MODIFY COLUMN `role` ENUM('admin', 'employee', 'Employee') DEFAULT 'Employee';

-- Rename 'name' column to 'fullName' if it exists
ALTER TABLE `Users` CHANGE COLUMN `name` `fullName` VARCHAR(100) NOT NULL;

SELECT 'Schema fixed successfully!' AS Status;
