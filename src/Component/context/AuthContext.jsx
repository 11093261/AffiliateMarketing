import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com" || "http://localhost:4500";
      
      console.log('Attempting login to:', `${BASE_URL}/api/login`);
      
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response. Check if backend is running.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Login response:', data);
      
      // Check if accessToken exists in response (backend returns accessToken, not token)
      if (!data.accessToken) {
        throw new Error('No access token received from server. Response format incorrect.');
      }
      
      // Store auth data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.accessToken);
      
      // Create user object from response
      const userData = {
        userId: data.userId,
        id: data.userId,
        _id: data.userId,
        email: email // Add email from login form
      };
      
      storage.setItem('user', JSON.stringify(userData));
      
      setToken(data.accessToken);
      setUser(userData);
      
      navigate('/dashboard');
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // IMPORTANT: Make sure this function is defined and exported in context
  const getAuthToken = () => {
    // Get token from state first, then from storage
    return token || localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const isAuthenticated = () => {
    return !!getAuthToken();
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getAuthToken, // MAKE SURE THIS IS INCLUDED
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};