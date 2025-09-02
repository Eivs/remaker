export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  author_id: number;
  created_at: string;
  updated_at?: string;
  author: User;
}

export interface ArticleCreate {
  title: string;
  content: string;
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
