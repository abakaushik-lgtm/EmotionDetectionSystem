import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setToken(null);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setToken(res.data.token);
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
    setToken(res.data.token);
  };

  const adminLogin = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/admin-login', { email, password });
    setToken(res.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, adminLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
