#!/bin/bash

# ============================================================
# 一键部署脚本 - 将项目构建并部署到阿里云轻量服务器
# 服务器：47.103.213.167 (Ubuntu 24.04)
# ============================================================

# ---------- 配置区 ----------
SERVER_IP="47.103.213.167"
SERVER_USER="root"
REMOTE_DIR="/var/www/wzjhub"    # 服务器上存放网站文件的目录
# ----------------------------

set -e  # 任何命令失败立即退出

echo "🔨 Step 1: 构建项目"
echo "   原因：将 React/TypeScript 源码编译为浏览器可直接运行的静态文件（HTML/CSS/JS）"
echo "   输出目录：dist/"
echo ""
npm run build

echo ""
echo "📦 Step 2: 上传构建产物到服务器"
echo "   原因：将本地 dist/ 目录的所有文件通过 SCP 传输到服务器指定目录"
echo "   目标：${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}"
echo ""

# 先在服务器上创建目录（如果不存在）
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${REMOTE_DIR}"

# 清空旧文件，避免残留
ssh ${SERVER_USER}@${SERVER_IP} "rm -rf ${REMOTE_DIR}/*"

# 上传新文件
scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/

echo ""
echo "⚙️  Step 3: 配置 Nginx（首次部署需要）"
echo "   原因：Nginx 是高性能 Web 服务器，负责接收浏览器请求并返回静态文件"
echo "   配置要点："
echo "   - 监听 80 端口"
echo "   - 将所有请求指向 ${REMOTE_DIR}"
echo "   - try_files 支持 React Router 的前端路由（刷新不 404）"
echo ""

# 生成 Nginx 配置并上传
ssh ${SERVER_USER}@${SERVER_IP} "cat > /etc/nginx/sites-available/wzjhub << 'EOF'
server {
    listen 80;
    server_name ${SERVER_IP};

    # 网站根目录
    root ${REMOTE_DIR};
    index index.html;

    # 支持 React Router 前端路由
    # 原因：SPA 应用只有一个 index.html，所有路由都由前端 JS 处理
    # 如果不加这个，直接访问 /nav 会返回 404
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # 静态资源缓存
    # 原因：JS/CSS 文件名带 hash，内容变了文件名也变，可以长期缓存提升加载速度
    location /assets/ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # favicon 缓存
    location /favicons/ {
        expires 30d;
        add_header Cache-Control \"public\";
    }
}
EOF"

# 启用站点配置
ssh ${SERVER_USER}@${SERVER_IP} "ln -sf /etc/nginx/sites-available/wzjhub /etc/nginx/sites-enabled/wzjhub"

# 删除默认站点（避免冲突）
ssh ${SERVER_USER}@${SERVER_IP} "rm -f /etc/nginx/sites-enabled/default"

# 测试 Nginx 配置是否正确
ssh ${SERVER_USER}@${SERVER_IP} "nginx -t"

echo ""
echo "🔄 Step 4: 重启 Nginx"
echo "   原因：让新的配置生效"
echo ""
ssh ${SERVER_USER}@${SERVER_IP} "systemctl restart nginx"

echo ""
echo "✅ 部署完成！"
echo "   访问地址：http://${SERVER_IP}"
echo ""
