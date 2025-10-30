import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, createUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await getUsers();
      const users = response.data;
      const foundUser = users.find(
        (u) => (u.username === username || u.email === username) && u.password === password
      );

      if (foundUser) {
        // For organizers, check if approved
        if (foundUser.role === 'organizer' && !foundUser.approved) {
          throw new Error('Your organizer account is pending approval');
        }
        
        const userData = { ...foundUser };
        delete userData.password; // Don't store password in state
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await getUsers();
      const existingUsers = response.data;
      
      // Check if username or email already exists
      const exists = existingUsers.some(
        (u) => u.username === userData.username || u.email === userData.email
      );
      
      if (exists) {
        throw new Error('Username or email already exists');
      }

      const newUser = {
        ...userData,
        approved: userData.role === 'organizer' ? false : true, // Organizers need approval
        createdAt: new Date().toISOString(),
      };

      const createResponse = await createUser(newUser);
      const createdUser = createResponse.data;
      delete createdUser.password;
      
      if (createdUser.approved) {
        setUser(createdUser);
        localStorage.setItem('user', JSON.stringify(createdUser));
      }
      
      return { success: true, user: createdUser, needsApproval: !createdUser.approved };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserData,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isOrganizer: user?.role === 'organizer',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

