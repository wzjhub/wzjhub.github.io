import { useState, useEffect } from 'react'
import { Typography, Input, Tag, Button, Modal, Form, Select, message, Popconfirm } from 'antd'
import { SearchOutlined, EditOutlined, PlusOutlined, DeleteOutlined, HolderOutlined, CheckOutlined, FireOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import SearchBar from '../../components/SearchBar'

const { Title } = Typography

export interface SiteItem {
  id: string
  title: string
  url: string
  desc: string
}

export interface Category {
  id: string
  name: string
  icon: string
  sites: SiteItem[]
}

const defaultCategories: Category[] = [
  {
    id: 'portal',
    name: '综合导航',
    icon: '🌐',
    sites: [
      { id: 'portal-1', title: '菜鸟工具', url: 'https://www.jyshare.com', desc: '开发设计在线工具集合' },
      { id: 'portal-2', title: '龙虾导航', url: 'https://www.claw123.com', desc: 'Claw123 网址导航' },
    ],
  },
  {
    id: 'ai',
    name: 'AI 工具',
    icon: '🤖',
    sites: [
      { id: 'ai-1', title: 'ChatGPT', url: 'https://chat.openai.com', desc: 'OpenAI 对话式 AI' },
      { id: 'ai-2', title: 'DeepSeek', url: 'https://chat.deepseek.com', desc: '深度求索 AI 助手' },
      { id: 'ai-3', title: 'Claude', url: 'https://claude.ai', desc: 'Anthropic AI 助手' },
      { id: 'ai-4', title: 'Kimi', url: 'https://kimi.moonshot.cn', desc: '月之暗面长文本 AI' },
      { id: 'ai-5', title: '通义千问', url: 'https://tongyi.aliyun.com', desc: '阿里 AI 大模型' },
      { id: 'ai-6', title: '豆包', url: 'https://www.doubao.com', desc: '字节跳动 AI 助手' },
      { id: 'ai-7', title: '智谱清言', url: 'https://chatglm.cn/main/alltoolsdetail', desc: '智谱 AI 全能工具' },
      { id: 'ai-8', title: '腾讯ima', url: 'https://ima.qq.com', desc: '腾讯 AI 助手' },
      { id: 'ai-9', title: 'zRead', url: 'https://zread.ai', desc: 'AI 阅读助手' },
      { id: 'ai-10', title: 'Google Labs', url: 'https://labs.google', desc: 'Google AI 实验室' },
    ],
  },
  {
    id: 'platform',
    name: '云平台',
    icon: '☁️',
    sites: [
      { id: 'plat-1', title: '阿里百炼', url: 'https://bailian.console.aliyun.com/?tab=app#/app-market', desc: '阿里云 AI 应用市场' },
      { id: 'plat-2', title: '火山引擎', url: 'https://console.volcengine.com', desc: '字节跳动云服务平台' },
      { id: 'plat-3', title: '阿里云盘', url: 'https://www.aliyundrive.com', desc: '阿里云盘网盘' },
      { id: 'plat-4', title: '百度网盘', url: 'https://pan.baidu.com', desc: '百度云存储' },
      { id: 'plat-8', title: '个人服务器', url: 'http://47.103.213.167', desc: '个人云服务器' },
      { id: 'plat-5', title: '飞书', url: 'https://accounts.feishu.cn', desc: '字节跳动协作办公平台' },
      { id: 'plat-9', title: '轻量应用服务器', url: 'https://swasnext.console.aliyun.com/servers/cn-shanghai', desc: '阿里云轻量服务器控制台' },
    ],
  },
  {
    id: 'mail',
    name: '邮箱通讯',
    icon: '📧',
    sites: [
      { id: 'mail-1', title: 'QQ邮箱', url: 'https://mail.qq.com', desc: '腾讯邮箱' },
      { id: 'mail-2', title: '网易邮箱', url: 'https://mail.163.com', desc: '网易免费邮箱' },
      { id: 'mail-3', title: '2925邮箱', url: 'https://www.2925.com/login/', desc: '2925 免费邮箱' },
      { id: 'mail-4', title: 'Gmail', url: 'https://mail.google.com/mail/u/0/#inbox', desc: 'Google 邮箱' },
    ],
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: '💻',
    sites: [
      { id: 'dev-1', title: 'GitHub', url: 'https://github.com', desc: '代码托管平台' },
      { id: 'dev-2', title: 'Gitee', url: 'https://gitee.com', desc: '国内代码托管' },
      { id: 'dev-3', title: 'npm', url: 'https://www.npmjs.com', desc: 'Node.js 包管理仓库' },
      { id: 'dev-4', title: 'Apifox', url: 'https://app.apifox.com/main', desc: 'API 设计开发测试' },
      { id: 'dev-5', title: 'JSON Viewer', url: 'https://jsonviewer.stack.hu', desc: 'JSON 在线可视化' },
      { id: 'dev-6', title: 'Learn Git', url: 'https://learngitbranching.js.org/?locale=zh_CN', desc: 'Git 分支交互式学习' },
      { id: 'dev-7', title: 'Redisson Wiki', url: 'https://github.com/redisson/redisson/wiki', desc: 'Redisson 分布式锁文档' },
      { id: 'dev-8', title: 'CodePen', url: 'https://codepen.io', desc: '前端在线编辑器' },
      { id: 'dev-9', title: 'Stack Overflow', url: 'https://stackoverflow.com', desc: '开发者问答社区' },
      { id: 'dev-10', title: 'MDN', url: 'https://developer.mozilla.org', desc: 'Web 开发文档' },
      { id: 'dev-11', title: 'JetBrains', url: 'https://www.jetbrains.com/products/', desc: 'IDE 开发工具全家桶' },
      { id: 'dev-12', title: 'v0', url: 'https://v0.app', desc: 'Vercel AI 前端代码生成' },
    ],
  },
  {
    id: 'tools',
    name: '在线工具',
    icon: '⚡',
    sites: [
      { id: 'tools-1', title: 'PDF24 Tools', url: 'https://tools.pdf24.org/zh/all-tools', desc: '免费 PDF 在线工具集' },
      { id: 'tools-2', title: '在线工具 tool.lu', url: 'https://tool.lu', desc: '开发者在线工具箱' },
      { id: 'tools-4', title: '条形码生成', url: 'https://www.dute.org/barcode', desc: '在线条形码生成器' },
      { id: 'tools-5', title: 'Labelary', url: 'https://labelary.com/viewer.html', desc: 'ZPL 标签在线预览' },
      { id: 'tools-6', title: '时间戳转换', url: 'https://tool.chinaz.com/tools/unixtime.aspx', desc: '站长工具时间戳转换' },
      { id: 'tools-7', title: 'JSON 格式化', url: 'https://www.json.cn', desc: 'JSON 在线解析' },
      { id: 'tools-8', title: '正则测试', url: 'https://regex101.com', desc: '正则表达式测试' },
      { id: 'tools-9', title: 'TinyPNG', url: 'https://tinypng.com', desc: '图片压缩' },
      { id: 'tools-10', title: 'Carbon', url: 'https://carbon.now.sh', desc: '代码截图美化' },
      { id: 'tools-11', title: 'Can I Use', url: 'https://caniuse.com', desc: '浏览器兼容性查询' },
      { id: 'tools-12', title: 'Excalidraw', url: 'https://excalidraw.com', desc: '在线白板画图' },
      { id: 'tools-13', title: 'PixPin', url: 'https://pixpin.cn/docs/start/quick-start', desc: '截图贴图工具' },
      { id: 'tools-14', title: 'Ditto', url: 'https://sabrogden.github.io/Ditto/', desc: '剪贴板增强管理工具' },
      { id: 'tools-15', title: '百度图片', url: 'https://image.baidu.com', desc: '百度图片搜索' },
      { id: 'tools-16', title: 'Infinity 新标签页', url: 'https://microsoftedge.microsoft.com/addons/detail/infinity-%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5-pro/hajlmbnnniemimmaehcefkamdadpjlfa', desc: 'Edge 新标签页扩展' },
    ],
  },
  {
    id: 'learn',
    name: '学习资源',
    icon: '📚',
    sites: [
      { id: 'learn-1', title: '语雀', url: 'https://www.yuque.com', desc: '知识管理协作平台' },
      { id: 'learn-2', title: '石墨文档', url: 'https://shimo.im', desc: '在线协作文档' },
      { id: 'learn-3', title: '微信读书', url: 'https://weread.qq.com', desc: '在线阅读' },
      { id: 'learn-4', title: '得到', url: 'https://www.dedao.cn', desc: '知识服务平台' },
      { id: 'learn-5', title: '掘金', url: 'https://juejin.cn', desc: '开发者技术社区' },
      { id: 'learn-6', title: 'LeetCode', url: 'https://leetcode.cn', desc: '算法刷题平台' },
      { id: 'learn-7', title: '菜鸟教程', url: 'https://www.runoob.com', desc: '编程入门教程' },
      { id: 'learn-8', title: '笔记', url: 'https://www.biji.com/note', desc: '在线笔记工具' },
      { id: 'learn-9', title: '天涯', url: 'https://www.tianya.im', desc: '天涯社区' },
    ],
  },
  {
    id: 'design',
    name: '设计资源',
    icon: '🎨',
    sites: [
      { id: 'design-1', title: 'Multiavatar', url: 'https://multiavatar.com', desc: '多元化头像生成器' },
      { id: 'design-2', title: 'Dribbble', url: 'https://dribbble.com', desc: '设计师作品展示' },
      { id: 'design-3', title: 'Figma', url: 'https://www.figma.com', desc: '在线设计协作工具' },
      { id: 'design-4', title: 'Unsplash', url: 'https://unsplash.com', desc: '免费高清图片' },
      { id: 'design-5', title: 'iconfont', url: 'https://www.iconfont.cn', desc: '阿里图标库' },
      { id: 'design-6', title: 'ColorHunt', url: 'https://colorhunt.co', desc: '配色方案' },
      { id: 'design-7', title: 'Pexels', url: 'https://www.pexels.com', desc: '免费图片视频素材' },
    ],
  },
  {
    id: 'media',
    name: '媒体娱乐',
    icon: '🎬',
    sites: [
      { id: 'media-1', title: 'Bilibili', url: 'https://www.bilibili.com', desc: '视频弹幕网站' },
      { id: 'media-2', title: 'YouTube', url: 'https://www.youtube.com', desc: '全球视频平台' },
      { id: 'media-3', title: 'Drive & Listen', url: 'https://driveandlisten.herokuapp.com', desc: '边开车边听各国街景' },
      { id: 'media-4', title: 'Google Earth', url: 'https://www.google.com/earth/studio', desc: 'Google 地球动画工作室' },
      { id: 'media-5', title: '网易云音乐', url: 'https://music.163.com', desc: '在线音乐' },
      { id: 'media-6', title: 'Spotify', url: 'https://www.spotify.com', desc: '流媒体音乐' },
    ],
  },
]

const STORAGE_KEY = 'nav_categories'

const loadCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return defaultCategories
}

const saveCategories = (cats: Category[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats))
}

// Click tracking for "frequently used"
const CLICKS_KEY = 'nav_clicks'

const getClickCounts = (): Record<string, number> => {
  try {
    const saved = localStorage.getItem(CLICKS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return {}
}

const recordClick = (siteId: string) => {
  const counts = getClickCounts()
  counts[siteId] = (counts[siteId] || 0) + 1
  localStorage.setItem(CLICKS_KEY, JSON.stringify(counts))
}

// Sortable category item in sidebar
const SortableCategoryItem = ({ category, isActive, isEditing, onClick }: { category: Category; isActive: boolean; isEditing: boolean; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={onClick}
        style={{
          padding: '9px 14px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: isActive ? '#6366f1' : 'rgba(255,255,255,0.7)',
          background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {isEditing && (
          <span {...attributes} {...listeners} style={{ cursor: 'grab', color: 'rgba(255,255,255,0.3)', marginRight: 4 }}>
            <HolderOutlined style={{ fontSize: '0.7rem' }} />
          </span>
        )}
        {category.icon} {category.name}
      </div>
    </div>
  )
}

const SortableSiteCard = ({ site, isEditing, onDelete }: { site: SiteItem; isEditing: boolean; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: site.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto' as any,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 10,
          background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          border: isDragging ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
          cursor: isEditing ? 'grab' : 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        onClick={() => {
          if (!isEditing) {
            recordClick(site.id)
            window.open(site.url, '_blank')
          }
        }}
      >
        {isEditing && (
          <span {...attributes} {...listeners} style={{ cursor: 'grab', color: 'rgba(255,255,255,0.3)' }}>
            <HolderOutlined />
          </span>
        )}
        <img
          src={`/favicons/${new URL(site.url).hostname.replace(/[^a-zA-Z0-9.]/g, '_')}.png`}
          alt=""
          style={{ width: 20, height: 20, borderRadius: 3, flexShrink: 0 }}
          onError={(e) => {
            const img = e.target as HTMLImageElement
            if (!img.dataset.fallback) {
              img.dataset.fallback = '1'
              img.src = `https://favicon.im/${new URL(site.url).hostname}`
            } else {
              img.style.display = 'none'
            }
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {site.title}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {site.desc}
          </div>
        </div>
        {isEditing && (
          <Popconfirm title="确定删除？" onConfirm={onDelete} okText="删除" cancelText="取消">
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: '0.8rem', cursor: 'pointer' }} />
          </Popconfirm>
        )}
      </div>
    </div>
  )
}

const NavigationPage = () => {
  const [categories, setCategories] = useState<Category[]>(loadCategories)
  const [search, setSearch] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  // Get frequently used sites (top 8 by click count)
  const clickCounts = getClickCounts()
  const allSites = categories.flatMap((cat) => cat.sites)
  const frequentSites = allSites
    .filter((site) => (clickCounts[site.id] || 0) > 0)
    .sort((a, b) => (clickCounts[b.id] || 0) - (clickCounts[a.id] || 0))
    .slice(0, 8)

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setCategories((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id)
      const newIndex = prev.findIndex((c) => c.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        const oldIndex = cat.sites.findIndex((s) => s.id === active.id)
        const newIndex = cat.sites.findIndex((s) => s.id === over.id)
        return { ...cat, sites: arrayMove(cat.sites, oldIndex, newIndex) }
      })
    )
  }

  const handleDelete = (categoryId: string, siteId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        return { ...cat, sites: cat.sites.filter((s) => s.id !== siteId) }
      })
    )
    message.success('已删除')
  }

  const handleAdd = (values: { title: string; url: string; desc: string; category: string }) => {
    const newSite: SiteItem = {
      id: `${values.category}-${Date.now()}`,
      title: values.title,
      url: values.url,
      desc: values.desc,
    }
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== values.category) return cat
        return { ...cat, sites: [...cat.sites, newSite] }
      })
    )
    message.success('已添加')
    setAddModalOpen(false)
    form.resetFields()
  }

  const handleReset = () => {
    setCategories(defaultCategories)
    message.success('已恢复默认')
  }

  const filteredCategories = search
    ? categories
        .map((cat) => ({
          ...cat,
          sites: cat.sites.filter(
            (site) =>
              site.title.toLowerCase().includes(search.toLowerCase()) ||
              site.desc.toLowerCase().includes(search.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.sites.length > 0)
    : categories

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '24px 16px 32px', gap: 24 }}>
      {/* Left sidebar */}
      <aside style={{ width: 150, flexShrink: 0, position: 'sticky', top: 88, height: 'fit-content' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.1)', padding: '12px 0 20px' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              {categories.map((cat) => (
                <SortableCategoryItem
                  key={cat.id}
                  category={cat}
                  isActive={activeCategory === cat.id}
                  isEditing={isEditing}
                  onClick={() => scrollToCategory(cat.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Search bar - centered */}
        <div style={{ maxWidth: 650, margin: '0 auto 20px' }}>
          <SearchBar />
        </div>

        {/* Edit toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            placeholder="站内搜索..."
            prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="small"
            style={{ flex: 1, minWidth: 160, maxWidth: 260, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(99, 102, 241, 0.2)', borderRadius: 8 }}
          />
          <Button
            type={isEditing ? 'primary' : 'default'}
            icon={isEditing ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setIsEditing(!isEditing)}
            size="small"
          >
            {isEditing ? '完成' : '编辑'}
          </Button>
          {isEditing && (
            <>
              <Button icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)} size="small">
                添加
              </Button>
              <Button size="small" onClick={handleReset}>
                恢复默认
              </Button>
            </>
          )}
        </div>

        {/* Frequently used */}
        {!search && frequentSites.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <FireOutlined style={{ fontSize: '1.1rem', marginRight: 6, color: '#f59e0b' }} />
              <Title level={5} style={{ margin: 0 }}>常用网站</Title>
              {isEditing && (
                <Button
                  size="small"
                  danger
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    localStorage.removeItem(CLICKS_KEY)
                    message.success('已清除常用记录')
                    setCategories([...categories]) // force re-render
                  }}
                >
                  清除记录
                </Button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {frequentSites.map((site) => (
                <motion.a
                  key={`freq-${site.id}`}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordClick(site.id)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                >
                  <img
                    src={`/favicons/${new URL(site.url).hostname.replace(/[^a-zA-Z0-9.]/g, '_')}.png`}
                    alt=""
                    style={{ width: 20, height: 20, borderRadius: 3, flexShrink: 0 }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src = `https://favicon.im/${new URL(site.url).hostname}`
                      } else {
                        img.style.display = 'none'
                      }
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {site.title}
                    </div>
                  </div>
                  {isEditing && (
                    <DeleteOutlined
                      style={{ color: '#ff4d4f', fontSize: '0.75rem', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const counts = getClickCounts()
                        delete counts[site.id]
                        localStorage.setItem(CLICKS_KEY, JSON.stringify(counts))
                        setCategories([...categories]) // force re-render
                        message.success('已移除')
                      }}
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {filteredCategories.map((category) => (
          <section key={category.id} id={`cat-${category.id}`} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.1rem', marginRight: 6 }}>{category.icon}</span>
              <Title level={5} style={{ margin: 0 }}>{category.name}</Title>
              <Tag style={{ marginLeft: 8, borderRadius: 10, fontSize: '0.7rem' }}>{category.sites.length}</Tag>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, category.id)}>
              <SortableContext items={category.sites.map((s) => s.id)} strategy={rectSortingStrategy}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {category.sites.map((site) => (
                    <SortableSiteCard
                      key={site.id}
                      site={site}
                      isEditing={isEditing}
                      onDelete={() => handleDelete(category.id, site.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
            没有找到匹配的网站
          </div>
        )}
      </main>

      {/* Add site modal */}
      <Modal
        title="添加网站"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={() => form.submit()}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="title" label="网站名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：GitHub" />
          </Form.Item>
          <Form.Item name="url" label="网址" rules={[{ required: true, message: '请输入网址' }]}>
            <Input placeholder="如：https://github.com" />
          </Form.Item>
          <Form.Item name="desc" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <Input placeholder="如：代码托管平台" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="选择分类">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NavigationPage
