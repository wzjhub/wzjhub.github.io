#!/bin/bash

# ============================================================
# 日常更新脚本 - 仅构建并上传（Nginx 已配置好后使用）
# ============================================================

SERVER_IP="47.103.213.167"
SERVER_USER="root"
REMOTE_DIR="/var/www/wzjhub"

set -e

echo "🔨 构建中..."
npm run build

echo "📦 上传中..."
ssh ${SERVER_USER}@${SERVER_IP} "rm -rf ${REMOTE_DIR}/*"
scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/

echo "✅ 更新完成！访问 http://${SERVER_IP}"
