import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

// Mock Users Database
const MOCK_USERS = {
  'admin@sia.ac.id': {
    id: 'adm-001',
    name: 'Joyo Adi R.',
    email: 'admin@sia.ac.id',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    departement: 'Bagian Administrasi Akademik (BAA)'
  },
  'dosen@sia.ac.id': {
    id: 'dsn-102',
    name: 'Dr. Ahmad Fauzi, M.T.',
    email: 'dosen@sia.ac.id',
    role: 'dosen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    nidn: '0420088501',
    faculty: 'Fakultas Ilmu Komputer',
    department: 'Teknik Informatika'
  },
  'mhs@sia.ac.id': {
    id: 'mhs-204',
    name: 'Reza Hendrawan',
    email: 'mhs@sia.ac.id',
    role: 'mahasiswa',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    nim: '2201010045',
    faculty: 'Fakultas Ilmu Komputer',
    department: 'Teknik Informatika',
    semester: 4,
    academicYear: '2025/2026 Ganjil',
    ips: 3.82,
    ipk: 3.65,
    sksTaken: 84
  }
};

import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from backend on initialization if token exists
  useEffect(() => {
    const fetchMe = async () => {
      const savedToken = localStorage.getItem('sia_token');
      if (savedToken) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
          localStorage.setItem('sia_user', JSON.stringify(response.data));
        } catch (err) {
          console.error('Session restoration failed:', err);
          localStorage.removeItem('sia_user');
          localStorage.removeItem('sia_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  /**
   * Logs in a user using email and password via backend.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;
      
      // Save to localStorage
      localStorage.setItem('sia_user', JSON.stringify(loggedUser));
      localStorage.setItem('sia_token', token);
      
      setUser(loggedUser);
      setLoading(false);
      return { success: true, user: loggedUser };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Terjadi kesalahan login.';
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  // Logs out the user
  const logout = () => {
    localStorage.removeItem('sia_user');
    localStorage.removeItem('sia_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
