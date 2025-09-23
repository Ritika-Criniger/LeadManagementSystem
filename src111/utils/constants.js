// Lead Status Options
export const LEAD_STATUS_OPTIONS = ['All', 'Assigned', 'InProgress', 'Completed', 'Pending'];

// Meeting Types
export const MEETING_TYPES = ['New', 'Follow-up', 'Review', 'Consultation', 'Presentation'];

// Meeting Agendas
export const MEETING_AGENDAS = ['New Business', 'Portfolio Review', 'Investment Planning', 'Risk Assessment', 'Client Onboarding'];

// Lead Sources
export const LEAD_SOURCES = ['Website', 'Social Media', 'Email Forms', 'Referrals', 'Cold Call', 'Walk-in', 'Others'];

// Colors for different statuses
export const STATUS_COLORS = {
  InProgress: '#ff9800',
  Completed: '#4caf50',
  Assigned: '#2196f3',
  Pending: '#e91e63',
  default: '#666'
};

// Gradient colors for stats cards
export const STATS_GRADIENTS = {
  totalLeads: ['#9c27b0', '#64b5f6'],
  hotLeads: ['#f44336', '#ff9800'],
  pendingMeetings: ['#ff9800', '#ffc107'],
  completedLeads: ['#4caf50', '#8bc34a'],
  default: ['#9c27b0', '#64b5f6']
};

// Pagination settings
export const PAGINATION_CONFIG = {
  defaultItemsPerPage: 5,
  maxVisiblePages: 5,
  showPageNumbers: false
};

// Responsive breakpoints
export const BREAKPOINTS = {
  tiny: 320,
  small: 350,
  medium: 400,
  large: 768
};
