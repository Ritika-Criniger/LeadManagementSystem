// Theme Colors for Lead Management System
export const COLORS = {
    // Primary Theme Colors
    primary: '#9c27b0',
    secondary: '#64b5f6',
    gradient: ['#9c27b0', '#64b5f6'],
    
    // Basic Colors
    white: '#ffffff',
    black: '#000000',
    gray: '#888888',
    lightGray: '#f5f5f5',
    darkGray: '#333333',
    
    // Status Colors
    red: '#f44336',
    green: '#4caf50',
    orange: '#ff9800',
    blue: '#2196f3',
    
    // Background Colors
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    
    // Border Colors
    border: '#e0e0e0',
    primaryBorder: '#9c27b0',
    
    // Text Colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textPlaceholder: '#999999',
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Notification
    notification: '#ffa726',
    
    // Progress Colors
    progressBackground: '#e0e0e0',
    progressActive: '#4caf50',
    
    // Status Colors for Leads
    inProgress: '#ff9800',
    completed: '#4caf50',
    assigned: '#2196f3',
  };
  
  // Gradient Combinations
  export const GRADIENTS = {
    primary: ['#9c27b0', '#64b5f6'],
    secondary: ['#757575', '#9e9e9e'],
    success: ['#4caf50', '#8bc34a'],
    warning: ['#ff9800', '#ffc107'],
    error: ['#f44336', '#e57373'],
  };
  
  // Common Styles
  export const COMMON_STYLES = {
    shadow: {
      elevation: 2,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    card: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 12,
      padding: 20,
    },
    gradientButton: {
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 8,
    },
    inputField: {
      borderBottomWidth: 2,
      borderBottomColor: COLORS.primaryBorder,
      paddingVertical: 12,
      paddingHorizontal: 4,
      fontSize: 16,
      color: COLORS.textPrimary,
    },
  };
  
  export default COLORS;