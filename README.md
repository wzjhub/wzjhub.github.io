# Wzjhub Portal

个人门户网站 + 通用工具库，基于 React + TypeScript + Ant Design 5 构建。

## 预览

🔗 [https://wzjhub.github.io](https://wzjhub.github.io)

## 特性

- 🎨 3D 粒子背景动画（Three.js + React Three Fiber）
- ✨ 页面切换动画（Framer Motion）
- 🌗 暗色/亮色主题切换
- 🛠️ 内置通用工具库，可独立复用到其他项目
- 📱 响应式设计
- 🚀 GitHub Actions 自动部署

## 通用工具库

位于 `src/libs/`，可直接复制到其他项目使用：

| 模块 | 说明 | 核心 API |
|------|------|----------|
| `request` | HTTP 请求封装 | `http.get/post/put/delete`、重试、取消、上传下载 |
| `datetime` | 时间处理 | `formatDate`、`fromNow`、`toUnix`、`formatDuration`、`toTimezone` |
| `storage` | 存储封装 | `storage.set/get/remove`、过期时间、命名空间 |
| `format` | 数据格式化 | `formatNumber`、`formatCurrency`、`formatFileSize`、`maskPhone` |
| `validators` | 表单验证 | `isPhone`、`isEmail`、`isStrongPassword`、兼容 Antd Form rules |

### 使用示例

```typescript
import { http, formatDate, storage, rules } from '@libs'

// HTTP 请求
const data = await http.get<User[]>('/api/users')

// 时间格式化
formatDate('2024-01-01')  // '2024-01-01 00:00:00'
fromNow('2024-01-01')     // '5个月前'

// 带过期时间的存储
storage.set('token', 'xxx', 3600)  // 1小时后过期
storage.get('token')               // 'xxx' 或 null（过期）

// Antd 表单验证
<Form.Item name="phone" rules={rules.phone}>
  <Input />
</Form.Item>
```

## 技术栈

- React 18 + TypeScript
- Vite 5
- Ant Design 5
- Three.js + React Three Fiber
- Framer Motion
- React Router 6
- Axios + Dayjs

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建产物
npm run preview
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

需要在仓库 Settings → Pages 中将 Source 设置为 **GitHub Actions**。

## 项目结构

```
src/
├── components/       # 通用组件（粒子背景、发光卡片、打字机）
├── layouts/          # 页面布局
├── libs/             # 通用工具库（可独立复用）
│   ├── request/      # HTTP 请求封装
│   ├── datetime/     # 时间处理
│   ├── storage/      # 存储封装
│   ├── format/       # 数据格式化
│   └── validators/   # 表单验证
├── pages/            # 页面（首页、工具、项目、关于）
├── styles/           # 全局样式
├── App.tsx           # 根组件（路由 + 主题）
└── main.tsx          # 入口
```

## License

MIT
