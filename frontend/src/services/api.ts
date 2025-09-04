import axios from "axios";
import type {
  Article,
  ArticleCreate,
  ArticleUpdate,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Tag,
  TagCreate,
  User,
} from "../types";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 添加请求拦截器，自动携带 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 添加响应拦截器，处理 token 失效
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 失效，清除本地存储
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 触发自定义事件，通知应用 token 失效
      window.dispatchEvent(
        new CustomEvent("auth:token-expired", {
          detail: { message: "登录已过期，请重新登录" },
        })
      );
    }
    return Promise.reject(error);
  }
);

// 认证相关 API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await api.post("/auth/login", formData);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};

// 文章相关 API
export const articlesAPI = {
  getUserArticles: async (tagId?: number): Promise<Article[]> => {
    const params = tagId ? { tag_id: tagId } : {};
    const response = await api.get("/articles", { params });
    return response.data;
  },

  getPublicArticles: async (tagId?: number): Promise<Article[]> => {
    const params = tagId ? { tag_id: tagId } : {};
    const response = await api.get("/articles/public", { params });
    return response.data;
  },

  getArticle: async (id: number): Promise<Article> => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (data: ArticleCreate): Promise<Article> => {
    const response = await api.post("/articles", data);
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

// 标签相关 API
export const tagsAPI = {
  getAllTags: async (): Promise<Tag[]> => {
    const response = await api.get("/tags");
    return response.data;
  },

  createTag: async (data: TagCreate): Promise<Tag> => {
    const response = await api.post("/tags", data);
    return response.data;
  },

  getTag: async (id: number): Promise<Tag> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  updateTag: async (id: number, data: TagCreate): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
