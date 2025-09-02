from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# 用户相关模式
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# 认证相关模式
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# 文章相关模式
class ArticleBase(BaseModel):
    title: str
    content: str

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: int
    is_published: bool
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    author: UserResponse
    
    class Config:
        from_attributes = True

class ArticleListResponse(BaseModel):
    id: int
    title: str
    is_published: bool
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    author: UserResponse
    
    class Config:
        from_attributes = True
