// Validation utility functions

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (10 digits)
const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Password validation (min 6 characters)
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Username validation (alphanumeric, 3-20 characters)
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Name validation (letters and spaces only)
const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

// Date validation (not in past for due dates)
const isValidFutureDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

// Tracking number validation
const isValidTrackingNumber = (trackingNumber) => {
  const trackingRegex = /^TRK\d{12}$/;
  return trackingRegex.test(trackingNumber);
};

// Validate task data
const validateTaskData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must not exceed 200 characters');
  }

  if (!data.dueDate) {
    errors.push('Due date is required');
  }

  if (data.dueDate && !isValidFutureDate(data.dueDate)) {
    errors.push('Due date cannot be in the past');
  }

  if (!['Low', 'Medium', 'High', 'Urgent'].includes(data.priority)) {
    errors.push('Invalid priority value');
  }

  if (data.assignedTo && !Array.isArray(data.assignedTo)) {
    errors.push('Assigned users must be an array');
  }

  return errors;
};

// Validate user data
const validateUserData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.fullName) {
    if (!data.fullName || !isValidName(data.fullName)) {
      errors.push('Full name must contain only letters and spaces (2-50 characters)');
    }
  }

  if (!isUpdate || data.username) {
    if (!data.username || !isValidUsername(data.username)) {
      errors.push('Username must be alphanumeric, 3-20 characters');
    }
  }

  if (!isUpdate || data.email) {
    if (!data.email || !isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
  }

  // Phone is optional - only validate if provided
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Phone number must be 10 digits');
  }

  if (!isUpdate && (!data.password || !isValidPassword(data.password))) {
    errors.push('Password must be at least 6 characters long');
  }

  if (data.password && !isValidPassword(data.password)) {
    errors.push('Password must be at least 6 characters long');
  }

  // Accept both 'admin' and 'employee' (case-insensitive)
  if (data.role && !['admin', 'Admin', 'employee', 'Employee'].includes(data.role)) {
    errors.push('Invalid role. Must be admin or Employee');
  }

  return errors;
};

// Validate courier data
const validateCourierData = (data) => {
  const errors = [];

  if (!data.senderName || !isValidName(data.senderName)) {
    errors.push('Sender name must contain only letters and spaces (2-50 characters)');
  }

  if (!data.receiverName || !isValidName(data.receiverName)) {
    errors.push('Receiver name must contain only letters and spaces (2-50 characters)');
  }

  if (!data.courierType || data.courierType.trim().length < 2) {
    errors.push('Courier type is required (minimum 2 characters)');
  }

  if (data.courierType && data.courierType.length > 50) {
    errors.push('Courier type must not exceed 50 characters');
  }

  if (!['Received', 'Delivered'].includes(data.status)) {
    errors.push('Invalid status. Must be Received or Delivered');
  }

  if (data.trackingNumber && !isValidTrackingNumber(data.trackingNumber)) {
    errors.push('Invalid tracking number format');
  }

  return errors;
};

// Validate task update data
const validateTaskUpdateData = (data) => {
  const errors = [];

  if (!data.taskId || isNaN(data.taskId)) {
    errors.push('Valid task ID is required');
  }

  if (!data.comment || data.comment.trim().length < 5) {
    errors.push('Comment must be at least 5 characters long');
  }

  if (!['Pending', 'In-Progress', 'Completed'].includes(data.status)) {
    errors.push('Invalid status. Must be Pending, In-Progress, or Completed');
  }

  if (data.hoursWorked && (isNaN(data.hoursWorked) || data.hoursWorked < 0)) {
    errors.push('Hours worked must be a positive number');
  }

  if (data.hoursWorked && data.hoursWorked > 24) {
    errors.push('Hours worked cannot exceed 24 hours per update');
  }

  return errors;
};

// Validate login credentials
const validateLoginData = (data) => {
  const errors = [];

  if (!data.username || data.username.trim().length < 3) {
    errors.push('Username is required');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('Password is required');
  }

  return errors;
};

// Validate registration data
const validateRegistrationData = (data) => {
  const errors = validateUserData(data, false);

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidUsername,
  isValidName,
  isValidFutureDate,
  isValidTrackingNumber,
  validateTaskData,
  validateUserData,
  validateCourierData,
  validateTaskUpdateData,
  validateLoginData,
  validateRegistrationData
};
