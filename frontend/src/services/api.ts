import axios from 'axios';
import type {
  Article,
  ArticleCreate,
  ArticleUpdate,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 添加请求拦截器，自动携带 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 认证相关 API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await api.post('/auth/login', formData);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// 文章相关 API
export const articlesAPI = {
  getUserArticles: async (): Promise<Article[]> => {
    const response = await api.get('/articles');
    return response.data;
  },

  getPublicArticles: async (): Promise<Article[]> => {
    const response = await api.get('/articles/public');
    return response.data;
  },

  getArticle: async (id: number): Promise<Article> => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (data: ArticleCreate): Promise<Article> => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  updateArticle: async (id: number, data: ArticleUpdate): Promise<Article> => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  publishArticle: async (id: number): Promise<Article> => {
    const response = await api.post(`/articles/${id}/publish`);
    return response.data;
  },

  unpublishArticle: async (id: number): Promise<Article> => {
    const response = await api.post(`/articles/${id}/unpublish`);
    return response.data;
  },
};
