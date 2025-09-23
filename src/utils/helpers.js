import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
export const scale = (size) => {
  const isTinyScreen = width < 320;
  const isSmallScreen = width < 350;
  const isLargePhone = width > 400;
  const isTablet = width > 768;
  
  if (isTinyScreen) return size * 0.85;
  if (isSmallScreen) return size * 0.9;
  if (isLargePhone) return size * 1.1;
  if (isTablet) return size * 1.3;
  return size;
};

export const moderateScale = (size, factor = 0.5) => scale(size) + (scale(size) - size) * factor;

// Date formatting utilities
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const formatTime = (time) => {
  if (!time) return '';
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// Search and filter utilities
export const filterLeads = (leads, searchParams) => {
  return leads.filter(lead => {
    const matchesName = !searchParams.name || 
      lead.name.toLowerCase().includes(searchParams.name.toLowerCase());
    const matchesStatus = !searchParams.status || 
      lead.status === searchParams.status;
    const matchesEmail = !searchParams.email || 
      lead.email.toLowerCase().includes(searchParams.email.toLowerCase());
    
    return matchesName && matchesStatus && matchesEmail;
  });
};

// Pagination utilities
export const getPaginatedData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export const getTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

// Status styling utilities
export const getStatusStyle = (status) => {
  switch (status) {
    case 'InProgress':
      return { backgroundColor: '#fff3e0' };
    case 'Completed':
      return { backgroundColor: '#e8f5e8' };
    case 'Assigned':
      return { backgroundColor: '#e3f2fd' };
    case 'Pending':
      return { backgroundColor: '#fce4ec' };
    default:
      return { backgroundColor: '#f5f5f5' };
  }
};

export const getStatusTextColor = (status) => {
  switch (status) {
    case 'InProgress':
      return '#ff9800';
    case 'Completed':
      return '#4caf50';
    case 'Assigned':
      return '#2196f3';
    case 'Pending':
      return '#e91e63';
    default:
      return '#666';
  }
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
