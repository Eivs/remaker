# 部署指南

## 🚀 生产环境部署

### 环境要求

- **后端**: Python 3.8+ 
- **前端**: Node.js 16+
- **数据库**: SQLite（已包含）

### 部署步骤

#### 1. 后端部署

```bash
# 克隆项目
git clone <your-repo-url>
cd markdown-app/backend

# 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或者在 Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env .env.production
# 编辑 .env.production，设置安全的 SECRET_KEY

# 启动生产服务器
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 2. 前端部署

```bash
cd markdown-app/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 部署 dist 文件夹到你的 web 服务器
# 例如：nginx, apache, vercel, netlify 等
```

### 环境变量配置

#### 后端 (.env)
```env
SECRET_KEY=your-super-secret-key-here-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./markdown_editor.db
```

#### 前端
在生产环境中，需要更新 `src/services/api.ts` 中的 `API_BASE_URL`：

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 🔧 Docker 部署（可选）

### Dockerfile - 后端

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile - 前端

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=your-secret-key
      - DATABASE_URL=sqlite:///./data/markdown_editor.db
    volumes:
      - ./data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔒 安全配置

### 生产环境安全清单

- [ ] 设置强密码的 SECRET_KEY（至少 32 个字符）
- [ ] 配置适当的 CORS 源域名
- [ ] 使用 HTTPS（SSL/TLS）
- [ ] 设置防火墙规则
- [ ] 配置反向代理（nginx/apache）
- [ ] 定期备份数据库
- [ ] 监控和日志记录

### CORS 生产配置

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "https://www.your-frontend-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 📊 性能优化

### 后端优化
- 使用 PostgreSQL 替代 SQLite（大规模应用）
- 添加数据库索引
- 实现 Redis 缓存
- 配置负载均衡

### 前端优化
- 启用代码分割和懒加载
- 配置 CDN
- 压缩静态资源
- 实现 PWA 功能

## 🔍 监控和维护

### 健康检查端点

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
```

### 日志配置

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
```

## 🔄 数据库迁移

对于生产环境，推荐使用 Alembic 进行数据库迁移管理：

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```
