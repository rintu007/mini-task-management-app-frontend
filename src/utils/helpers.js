// Format date to readable string
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Check if user has required role
export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false;
  
  const roleHierarchy = {
    admin: 3,
    manager: 2,
    member: 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Debounce function for limiting API calls
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