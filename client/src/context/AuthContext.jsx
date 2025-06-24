import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          
          // If we have stored user data, use it immediately for faster loading
          if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user,
                token
              }
            });
          }
          
          // Then validate the token by fetching fresh user data
          const response = await authAPI.getProfile();
          const freshUser = response.data.user;
          
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(freshUser));
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: freshUser,
              token
            }
          });
        } catch (error) {
          // Clear invalid data from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({
            type: 'AUTH_FAILURE',
            payload: 'Session expired. Please login again.'
          });
        }
      } else {
        // Clear any stale data
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;
      
      // Store both token and user data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!state.user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(state.user.role);
    }
    
    return state.user.role === roles;
  };

  // Check if user has permission for specific base
  const hasBaseAccess = (baseId) => {
    if (!state.user) return false;
    
    // Admin has access to all bases
    if (state.user.role === 'admin') return true;
    
    // Base commander and logistics officer can only access their assigned base
    if (state.user.role === 'baseCommander' || state.user.role === 'logisticsOfficer') {
      return state.user.baseId === baseId;
    }
    
    return false;
  };

  // Get stored authentication data (for debugging or manual checks)
  const getStoredAuthData = () => {
    return {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
      isAuthenticated: !!localStorage.getItem('token')
    };
  };


  const clearStoredAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
    hasRole,
    hasBaseAccess,
    getStoredAuthData,
    clearStoredAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 