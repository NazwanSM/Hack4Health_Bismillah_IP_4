"use client";

// Check if this is user's first time using the app
export const checkFirstTimeUser = (): boolean => {
  if (typeof window === 'undefined') return true; // Server-side rendering fallback
  return localStorage.getItem('hasVisitedBefore') !== 'true';
};

// Mark that user has viewed the welcome screen
export const setFirstTimeViewed = (): void => {
  if (typeof window === 'undefined') return; // Server-side rendering fallback
  localStorage.setItem('hasVisitedBefore', 'true');
};

// Check if the user is logged in
export const checkUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false; // Server-side rendering fallback
  return localStorage.getItem('authToken') !== null;
};

// Login user
export const loginUser = (token: string, userData: UserData): void => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(userData));
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Get user data
interface UserData {
  // Define the structure of user data here
  // Ensure this matches the expected structure of userData
  name: string;
  email: string;
  // Add other fields as needed
}

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null; // Server-side rendering fallback
  
  const userData = localStorage.getItem('userData');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    console.error('Failed to parse user data');
    return null;
  }
};