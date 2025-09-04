export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface TagCreate {
  name: string;
  color?: string;
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
  tags: Tag[];
}

export interface ArticleCreate {
  title: string;
  content: string;
  tag_ids?: number[];
}

export interface ArticleUpdate {
  title?: string;
  content?: string;
  tag_ids?: number[];
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
