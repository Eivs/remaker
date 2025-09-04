# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ 项目架构

这是一个全栈 Markdown 编辑器应用，包含：
- **前端**: React + TypeScript + Vite + TailwindCSS
- **后端**: FastAPI (Python) + SQLite
- **代码质量**: Biome (格式化) + ESLint (linting)

## 🚀 开发命令

### 前端 (frontend/)
- `npm run dev` - 启动开发服务器 (localhost:3000)
- `npm run build` - 构建生产版本 (TypeScript 编译 + Vite 构建)
- `npm run lint` - 运行 Biome 检查并自动修复
- `npm run preview` - 预览构建后的应用

### 后端 (backend/)
- `uvicorn main:app --reload` - 启动开发服务器 (localhost:8000)
- `python main.py` - 直接运行后端
- **注意**: 启动脚本期望虚拟环境位于 `backend/.venv/`

### 完整启动
- `./start-dev.sh` - 同时启动前后端开发服务器（自动激活虚拟环境）

## 📁 项目结构

```
remaker/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   ├── contexts/        # React Context
│   │   ├── services/        # API 服务
│   │   └── types/           # TypeScript 类型定义
│   ├── biome.json           # Biome 配置
│   └── package.json
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── routers/         # API 路由
│   │   ├── models.py        # 数据库模型
│   │   ├── schemas.py       # Pydantic 模式
│   │   └── auth.py          # 认证逻辑
│   ├── main.py              # 应用入口
│   └── pyproject.toml       # Python 依赖
├── start-dev.sh             # 开发环境启动脚本
├── README.md                # 项目说明
└── DEPLOYMENT.md            # 部署指南
```

## 🔧 开发工具配置

### 前端代码质量
- **Biome**: 代码格式化和基础 linting（2空格缩进，单引号，80字符行宽）
- 特定配置：禁用了部分无障碍性检查
- 配置文件: `frontend/biome.json`

### 后端依赖管理
- 使用 `pyproject.toml` 管理依赖
- Python 版本要求: >=3.11
- 核心依赖: FastAPI 0.115.0, SQLAlchemy 2.0.36, JWT 认证

## 🌐 API 结构

后端提供以下主要端点：
- **认证路由** (`/api/auth`): 用户注册、登录
- **文章路由** (`/api`): 文章 CRUD 操作
- **标签路由** (`/api`): 标签管理（新增功能）
- 完整 API 文档: http://localhost:8000/docs

### 数据库模型
- **User**: 用户认证和管理
- **Article**: 文章内容和元数据，支持作者关联
- **Tag**: 标签系统，与文章多对多关联

## 🎯 开发注意事项

1. **前端技术栈**: React 19 + TypeScript + Vite，支持 Markdown 渲染、语法高亮、Mermaid 图表
2. **国际化支持**: 完整的中英文国际化，使用 I18nContext 管理翻译
3. **前端 API 配置**: API 基础 URL 配置在 `src/services/api.ts`
4. **后端虚拟环境**: 启动脚本期望虚拟环境位于 `backend/.venv/`
5. **认证系统**: 基于 JWT token，支持用户注册和登录
6. **数据库**: SQLite 数据库，支持用户、文章、标签的关联管理
7. **CORS 配置**: 后端已配置允许 localhost:3000 的跨域访问

### 国际化实现

- **Context 位置**: `src/contexts/I18nContext.tsx`
- **语言切换**: LanguageSwitcher 组件支持中英文切换
- **本地存储**: 语言偏好自动保存到 localStorage
- **覆盖范围**: 所有用户界面文本已完全国际化
- **使用方式**: 在组件中使用 `const { t } = useI18n(); t('key')`

## 📚 相关文档

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [React 文档](https://react.dev/)
- [Biome 文档](https://biomejs.dev/)
- [TailwindCSS 文档](https://tailwindcss.com/)