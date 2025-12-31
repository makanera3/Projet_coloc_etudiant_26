
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for persisted session in sessionStorage (simulating browser session)
    const storedUser = sessionStorage.getItem('colocetudiant_session');
    if (storedUser) {
      setAuth({
        user: JSON.parse(storedUser),
        isAuthenticated: true
      });
    }
  }, []);

  const login = (user: User) => {
    sessionStorage.setItem('colocetudiant_session', JSON.stringify(user));
    setAuth({
      user,
      isAuthenticated: true
    });
  };

  const logout = () => {
    sessionStorage.removeItem('colocetudiant_session');
    setAuth({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
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