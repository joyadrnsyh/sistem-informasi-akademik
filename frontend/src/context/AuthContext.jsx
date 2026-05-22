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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('sia_user');
    const savedToken = localStorage.getItem('sia_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Logs in a user using email and password.
   * Supports mock credentials:
   * - admin@sia.ac.id / admin123
   * - dosen@sia.ac.id / dosen123
   * - mhs@sia.ac.id / mhs123
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const mockUser = MOCK_USERS[trimmedEmail];
      
      // Match passwords based on the mock roles
      const expectedPassword = 
        trimmedEmail === 'admin@sia.ac.id' ? 'admin123' :
        trimmedEmail === 'dosen@sia.ac.id' ? 'dosen123' :
        trimmedEmail === 'mhs@sia.ac.id' ? 'mhs123' : null;

      if (mockUser && expectedPassword === password) {
        const token = `mock-jwt-token-for-${mockUser.role}-${Date.now()}`;
        
        // Save to localStorage
        localStorage.setItem('sia_user', JSON.stringify(mockUser));
        localStorage.setItem('sia_token', token);
        
        setUser(mockUser);
        setLoading(false);
        return { success: true, user: mockUser };
      } else {
        throw new Error('Email atau password salah!');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
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
