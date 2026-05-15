import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('oca_token'));
  const [loading, setLoading] = useState(true);

  // Imposta header axios globale
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.membro);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/accedi', { email, password });
    localStorage.setItem('oca_token', data.token);
    setToken(data.token);
    setUser(data.membro);
    return data;
  };

  const registra = async (formData) => {
    const { data } = await axios.post('/api/auth/registra', formData);
    localStorage.setItem('oca_token', data.token);
    setToken(data.token);
    setUser(data.membro);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('oca_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registra, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
