from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Article, Tag
from ..schemas import ArticleCreate, ArticleUpdate, ArticleResponse, ArticleListResponse
from ..auth import get_current_user

router = APIRouter()

@router.get("/articles", response_model=List[ArticleListResponse])
async def get_user_articles(
    tag_id: Optional[int] = Query(None, description="按标签ID筛选"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取当前用户的所有文章"""
    query = db.query(Article).filter(Article.author_id == current_user.id)
    
    if tag_id:
        query = query.join(Article.tags).filter(Tag.id == tag_id)
    
    articles = query.all()
    return articles

@router.get("/articles/public", response_model=List[ArticleListResponse])
async def get_public_articles(
    tag_id: Optional[int] = Query(None, description="按标签ID筛选"),
    db: Session = Depends(get_db)
):
    """获取所有已发布的文章"""
    query = db.query(Article).filter(Article.is_published == True)
    
    if tag_id:
        query = query.join(Article.tags).filter(Tag.id == tag_id)
    
    articles = query.all()
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
    
    # 添加标签
    if article.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(article.tag_ids)).all()
        db_article.tags = tags
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
    tag_ids = update_data.pop('tag_ids', None)
    
    for field, value in update_data.items():
        setattr(article, field, value)
    
    # 更新标签
    if tag_ids is not None:
        if tag_ids:
            tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
            article.tags = tags
        else:
            article.tags = []
    
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
