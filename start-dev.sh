#!/bin/bash

# Markdown Editor 开发环境启动脚本

echo "🚀 启动 Markdown Editor 开发环境..."

# 检查是否在正确的目录
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 启动后端
echo "📡 启动后端服务器..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端开发服务器..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 开发环境启动完成！"
echo ""
echo "📍 服务地址："
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:8000"
echo "   API 文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
