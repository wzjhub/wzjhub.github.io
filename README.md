# Wzjhub Portal

个人门户网站 + 网址导航，基于 React + TypeScript + Ant Design 5 构建。

## 预览

🔗 [https://wzjhub.github.io](https://wzjhub.github.io)

## 特性

- 🎨 3D 粒子背景动画（Three.js + React Three Fiber）
- ✨ 淡入淡出文字轮播（Framer Motion）
- � 网址导航（分类管理、搜索过滤、拖拽排序、本地持久化）
- � 编辑模式（添加/删除/排序网站和分类）
- � 实时搜索过滤
- 🚀 GitHub Actions 自动部署

## 网址导航功能

- 左侧分类菜单，点击快速跳转
- 网站卡片显示 favicon + 名称 + 描述
- 编辑模式下支持拖拽排序（分类和网站）
- 支持添加/删除网站
- 所有修改自动保存到 localStorage
- 一键恢复默认数据

## 技术栈

- React 18 + TypeScript
- Vite 5
- Ant Design 5
- Three.js + React Three Fiber
- Framer Motion
- React Router 6
- @dnd-kit（拖拽排序）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

需要在仓库 Settings → Pages 中将 Source 设置为 **GitHub Actions**。

## 项目结构

```
src/
├── components/       # 通用组件（粒子背景、打字机、发光卡片）
├── layouts/          # 页面布局
├── libs/             # 通用工具库（可独立复用）
│   ├── request/      # HTTP 请求封装
│   ├── datetime/     # 时间处理
│   ├── storage/      # 存储封装
│   ├── format/       # 数据格式化
│   └── validators/   # 表单验证
├── pages/            # 页面（首页、导航）
├── styles/           # 全局样式
├── App.tsx           # 根组件
└── main.tsx          # 入口
```

## License

MIT
