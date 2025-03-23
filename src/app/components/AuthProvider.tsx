"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { getUserData } from '../utils/authService';
import { checkFirstTimeUser, setFirstTimeViewed as markFirstTimeViewed } from '../utils/authUtils';

interface UserData {
  id: string; // Memastikan id adalah wajib
  name: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  birthdate?: string;
  gender?: string;
  NIK?: string;
  nationality?: string;
  isMedicalStaff?: boolean;
  surveyAnswers?: { [key: number]: string };
}

interface AuthContextType {
  isFirstTimeUser: boolean;
  setFirstTimeViewed: () => void;
  isLoggedIn: boolean;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  user: UserData | null;
  isLoading: boolean;
  userId: string | null; // Tambahkan userId untuk akses mudah
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Track userId separately
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check Firebase auth state on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // User is signed in
        try {
          const currentUserId = firebaseUser.uid;
          setUserId(currentUserId); // Set userId immediately
          
          // Get the user data from Firestore
          const userData = await getUserData(currentUserId);
          
          if (userData) {
            setUser({
              id: currentUserId, // Always ensure ID is set correctly
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              emergencyContact: userData.emergencyContact || '',
              birthdate: userData.birthdate || '',
              gender: userData.gender || '',
              NIK: userData.NIK || '',
              nationality: userData.nationality || '',
              isMedicalStaff: userData.isMedicalStaff || false,
              surveyAnswers: userData.surveyAnswers || {}
            });
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setUserId(null);
          setIsLoggedIn(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserId(null);
        setIsLoggedIn(false);
      }
      
      // Check if it's first time user
      setIsFirstTimeUser(checkFirstTimeUser());
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (token: string, userData: UserData) => {
    setUser(userData);
    setUserId(userData.id); // Set userId when logging in
    setIsLoggedIn(true);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserId(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const setFirstTimeViewed = () => {
    markFirstTimeViewed();
    setIsFirstTimeUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isFirstTimeUser,
        setFirstTimeViewed,
        isLoggedIn,
        login,
        logout,
        user,
        userId, // Expose userId specifically for ease of access
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};