from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, articles

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Markdown Editor API",
    description="支持用户认证和文章管理的 Markdown 编辑器 API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 开发服务器端口
        "http://localhost:5174",  # Vite 备用端口
        "http://localhost:3000",  # 可能的其他端口
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(articles.router, prefix="/api", tags=["文章"])

@app.get("/")
async def root():
    return {"message": "Markdown Editor API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
