import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import type { LoginRequest, RegisterRequest, User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查本地存储中是否有 token
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // 监听 token 失效事件
    const handleTokenExpired = (event: CustomEvent) => {
      setError(event.detail.message);
      setUser(null);
      navigate('/login');
    };

    window.addEventListener(
      'auth:token-expired',
      handleTokenExpired as EventListener
    );

    return () => {
      window.removeEventListener(
        'auth:token-expired',
        handleTokenExpired as EventListener
      );
    };
  }, [navigate]);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.access_token);

      // 这里简化处理，实际应用中可能需要单独的 API 获取用户信息
      // 暂时使用用户名创建用户对象
      const userData = {
        id: 0, // 需要从后端获取实际 ID
        username: data.username,
        email: '', // 需要从后端获取
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '登录失败');
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const user = await authAPI.register(data);
      // 注册成功后自动登录
      await login({ username: data.username, password: data.password });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || '注册失败');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
