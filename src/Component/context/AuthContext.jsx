import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // ✅ Dynamic base URL – same as Signup/Login components
  const BASE_URL = import.meta.env.VITE_API_URL || "https://afffiliate.onrender.com";

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        console.log('Initializing auth...');
        console.log('Stored token found:', !!storedToken);
        console.log('Stored user found:', !!storedUser);
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('Auth restored successfully');
        } else {
          console.log('No stored auth found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password, rememberMe = false) => {
    try {
      setAuthError(null);
      
      console.log('Attempting login for:', email);
      
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Login failed with status: ${response.status}`;
        } catch (parseError) {
          const text = await response.text();
          errorMessage = `Server error: ${response.status} - ${text.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login response received:', data);
      
      const authToken = data.accessToken || data.token || data.jwtToken;
      if (!authToken) {
        console.error('No token in response:', data);
        throw new Error('No authentication token received from server');
      }
      
      // Store auth data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', authToken);
      setToken(authToken);
      
      // Fetch full user details using the token
      const userResponse = await fetch(`${BASE_URL}/api/getAuser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        console.warn('Could not fetch user details after login');
        // Fallback: create minimal user object
        const fallbackUser = {
          userId: data.userId || data._id || data.id,
          _id: data.userId || data._id || data.id,
          email: email,
          username: email.split('@')[0]
        };
        storage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
      } else {
        const userData = await userResponse.json();
        // userData.data contains the full user (without password)
        const fullUser = userData.data;
        const userObj = {
          userId: fullUser._id,
          _id: fullUser._id,
          username: fullUser.username,
          email: fullUser.email,
          phone: fullUser.phone,
          company: fullUser.company,
          onboarding: fullUser.onboarding,
          stats: fullUser.stats
        };
        storage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
      }
      
      setAuthError(null);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard', { replace: true });
      
      return { 
        success: true, 
        data: data,
        token: authToken,
        user: user
      };
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message);
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  };

  const logout = useCallback(() => {
    console.log('Logging out user');
    setUser(null);
    setToken(null);
    setAuthError(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    navigate('/login', { replace: true });
  }, [navigate]);

  const getAuthToken = useCallback(() => {
    if (token) return token;
    const localToken = localStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
      return localToken;
    }
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      setToken(sessionToken);
      return sessionToken;
    }
    return null;
  }, [token]);

  const isAuthenticated = useCallback(() => {
    const currentToken = getAuthToken();
    if (!currentToken) return false;
    
    try {
      const payload = JSON.parse(atob(currentToken.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.log('Token expired');
        logout();
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  }, [getAuthToken, logout]);

  const validateToken = async () => {
    try {
      const currentToken = getAuthToken();
      if (!currentToken) return false;
      
      const response = await fetch(`${BASE_URL}/api/getAuser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const currentToken = getAuthToken();
      if (!currentToken) return null;
      
      // Optional: implement actual refresh endpoint
      // const response = await fetch(`${BASE_URL}/api/refreshToken`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ refreshToken: currentToken }) // if you store refresh token separately
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   const newToken = data.accessToken;
      //   // update storage
      //   const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      //   storage.setItem('token', newToken);
      //   setToken(newToken);
      //   return newToken;
      // }
      return currentToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    authError,
    login,
    logout,
    getAuthToken,
    isAuthenticated,
    validateToken,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};