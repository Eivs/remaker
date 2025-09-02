from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Article
from ..schemas import ArticleCreate, ArticleUpdate, ArticleResponse, ArticleListResponse
from ..auth import get_current_user

router = APIRouter()

@router.get("/articles", response_model=List[ArticleListResponse])
async def get_user_articles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取当前用户的所有文章"""
    articles = db.query(Article).filter(Article.author_id == current_user.id).all()
    return articles

@router.get("/articles/public", response_model=List[ArticleListResponse])
async def get_public_articles(db: Session = Depends(get_db)):
    """获取所有已发布的文章"""
    articles = db.query(Article).filter(Article.is_published == True).all()
    return articles

@router.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取指定文章详情"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 检查权限：只有作者或已发布的文章才能查看
    if article.author_id != current_user.id and not article.is_published:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限访问此文章"
        )
    
    return article

@router.post("/articles", response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新文章"""
    db_article = Article(
        title=article.title,
        content=article.content,
        author_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: int,
    article_update: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新文章"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 检查权限：只有作者才能编辑
    if article.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限编辑此文章"
        )
    
    # 更新文章
    update_data = article_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(article, field, value)
    
    db.commit()
    db.refresh(article)
    return article

@router.delete("/articles/{article_id}")
async def delete_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除文章"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 检查权限：只有作者才能删除
    if article.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限删除此文章"
        )
    
    db.delete(article)
    db.commit()
    return {"message": "文章已删除"}

@router.post("/articles/{article_id}/publish", response_model=ArticleResponse)
async def publish_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """发布文章"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 检查权限：只有作者才能发布
    if article.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限发布此文章"
        )
    
    article.is_published = True
    db.commit()
    db.refresh(article)
    return article

@router.post("/articles/{article_id}/unpublish", response_model=ArticleResponse)
async def unpublish_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """取消发布文章"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文章不存在"
        )
    
    # 检查权限：只有作者才能取消发布
    if article.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限操作此文章"
        )
    
    article.is_published = False
    db.commit()
    db.refresh(article)
    return article
