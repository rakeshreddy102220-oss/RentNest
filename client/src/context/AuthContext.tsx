import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { UserPayload } from '../types';
import { fetchMe } from '../utils/api';

interface AuthState {
  user: UserPayload | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserPayload | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rentnest_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('rentnest_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('rentnest_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, setUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
