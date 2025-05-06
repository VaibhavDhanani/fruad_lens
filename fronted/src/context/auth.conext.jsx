// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {loginUser,registerUser,verifyToken} from '../services/auth.service'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      // This will be implemented in authService.js
      const response = await loginUser(username, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      // console.log(response);
      navigate('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name, username,email, password) => {
    try {
      // This will be implemented in authService.js
      const response = await registerUser(name, username, email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      navigate('/dashboard'); // Redirect after signup
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  // useEffect(() => {
  //   // Check if user is authenticated when app loads
  //   const verifyAuth = async () => {
  //     if (token) {
  //       try {
  //         // This will be implemented in authService.js
  //         const userData = await verifyToken(token);
  //         setUser(userData);
  //       } catch (error) {
  //         logout();
  //       }
  //     }
  //   };
  //   verifyAuth();
  // }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);