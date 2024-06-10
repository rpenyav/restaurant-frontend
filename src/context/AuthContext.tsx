import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../api/axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  error: string | null;
}

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  address: string;
  postalcode: string;
  phone1: string;
  isActive: boolean;
}

interface DecodedToken {
  email: string;
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        fetchUser(decoded.userId, token);
        setIsAuthenticated(true);
      } else {
        Cookies.remove('access_token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { access_token } = response.data;
      Cookies.set('access_token', access_token);
      const decoded: DecodedToken = jwtDecode(access_token);
      fetchUser(decoded.userId, access_token);
      setIsAuthenticated(true);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error logging in');
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchUser = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
