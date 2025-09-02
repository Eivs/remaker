# Markdown 编辑器全栈应用

一个支持 Markdown 编辑、实时预览、用户登录、文章保存与发布的全栈 Web 应用。

## 技术栈

### 前端
- React：构建用户界面
- TailwindCSS：快速开发响应式样式
- Vite：前端构建工具
- Biome：代码格式化与质量保障工具

### 后端
- FastAPI (Python)：高性能 Web API 框架
- SQLite：轻量级数据库

## 功能特性

- 🔐 用户注册和登录认证
- ✏️ Markdown 实时编辑和预览
- 📝 文章创建、编辑、保存和发布
- 📚 浏览其他用户发布的文章
- 🗄️ 数据持久化存储

## 项目结构

```
markdown-app/
├── frontend/          # React 前端应用
└── backend/           # FastAPI 后端应用
```

## 快速开始

### 后端启动
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## API 文档

启动后端后，访问 http://localhost:8000/docs 查看 API 文档。
