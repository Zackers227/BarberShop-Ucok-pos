// Client-side permission helper

export function hasPermission(user, permission) {
  if (!user) return false;
  
  // Owner has all permissions
  if (user.role?.toLowerCase() === 'owner') {
    return true;
  }
  
  // Check if user has the specific permission
  return user.permissions?.includes(permission) || false;
}

export function hasAnyPermission(user, permissions) {
  if (!user) return false;
  if (user.role?.toLowerCase() === 'owner') return true;
  
  return permissions.some(perm => user.permissions?.includes(perm));
}

export function hasAllPermissions(user, permissions) {
  if (!user) return false;
  if (user.role?.toLowerCase() === 'owner') return true;
  
  return permissions.every(perm => user.permissions?.includes(perm));
}

// Get user permissions from localStorage
export function getUserPermissions() {
  if (typeof window === 'undefined') return [];
  
  const userData = localStorage.getItem('user');
  if (!userData) return [];
  
  try {
    const user = JSON.parse(userData);
    return user.permissions || [];
  } catch {
    return [];
  }
}

// Update user data with permissions
export async function refreshUserPermissions(token) {
  try {
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
  } catch (error) {
    console.error('Error refreshing permissions:', error);
  }
  return null;
}
