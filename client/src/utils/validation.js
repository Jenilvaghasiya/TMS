// Client-side validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateTaskTitle = (title) => {
  return title && title.trim().length >= 3 && title.length <= 200;
};

export const validateComment = (comment) => {
  return comment && comment.trim().length >= 5;
};

export const validateHoursWorked = (hours) => {
  const num = parseFloat(hours);
  return !isNaN(num) && num >= 0 && num <= 24;
};

export const validateFutureDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const showValidationError = (field, message, toast) => {
  toast.error(`${field}: ${message}`);
};
