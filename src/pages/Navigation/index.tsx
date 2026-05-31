import { useState, useEffect } from 'react'
import { Typography, Input, Tag, Button, Modal, Form, Select, message, Popconfirm, Tooltip } from 'antd'
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
import { defaultCategories } from './data'
import type { SiteItem, Category } from './data'

const { Title } = Typography

const STORAGE_KEY = 'nav_categories'
const CLICKS_KEY = 'nav_clicks'

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

// Sortable category item
const SortableCategoryItem = ({ category, isActive, isEditing, onClick }: { category: Category; isActive: boolean; isEditing: boolean; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={onClick}
        style={{
          padding: '9px 14px', cursor: 'pointer', fontSize: '0.85rem',
          color: isActive ? '#6366f1' : 'rgba(255,255,255,0.7)',
          background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
          transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4,
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

// Sortable site card
const SortableSiteCard = ({ site, isEditing, onDelete }: { site: SiteItem; isEditing: boolean; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: site.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 100 : 'auto' as any }

  return (
    <div ref={setNodeRef} style={style}>
      <Tooltip title={site.desc} placement="bottom">
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
            background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: isDragging ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
            cursor: isEditing ? 'grab' : 'pointer', transition: 'all 0.2s', position: 'relative',
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
              } else { img.style.display = 'none' }
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
      </Tooltip>
    </div>
  )
}

const NavigationPage = () => {
  const [categories, setCategories] = useState<Category[]>(loadCategories)
  const [search, setSearch] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768)
  const [form] = Form.useForm()
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => { saveCategories(categories) }, [categories])

  useEffect(() => {
    const handler = () => setSidebarCollapsed((prev) => !prev)
    window.addEventListener('toggle-sidebar', handler)
    return () => window.removeEventListener('toggle-sidebar', handler)
  }, [])

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
    setCategories((prev) => prev.map((cat) => cat.id !== categoryId ? cat : { ...cat, sites: cat.sites.filter((s) => s.id !== siteId) }))
    message.success('已删除')
  }

  const handleAdd = (values: { title: string; url: string; desc: string; category: string }) => {
    const newSite: SiteItem = { id: `${values.category}-${Date.now()}`, title: values.title, url: values.url, desc: values.desc }
    setCategories((prev) => prev.map((cat) => cat.id !== values.category ? cat : { ...cat, sites: [...cat.sites, newSite] }))
    message.success('已添加')
    setAddModalOpen(false)
    form.resetFields()
  }

  const handleReset = () => { setCategories(defaultCategories); message.success('已恢复默认') }

  const filteredCategories = search
    ? categories.map((cat) => ({ ...cat, sites: cat.sites.filter((site) => site.title.toLowerCase().includes(search.toLowerCase()) || site.desc.toLowerCase().includes(search.toLowerCase()) || site.url.toLowerCase().includes(search.toLowerCase())) })).filter((cat) => cat.sites.length > 0)
    : categories

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    const el = document.getElementById(`cat-${id}`)
    if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: 'smooth' }) }
  }

  return (
    <div className="nav-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px 32px' }}>
      {/* Mobile category tabs */}
      <div className="nav-mobile-tabs" style={{ display: 'none', position: 'relative', marginBottom: 16 }}>
        <div style={{ overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch' as any }}>
          <div style={{ display: 'inline-flex', gap: 8, whiteSpace: 'nowrap', minWidth: 'max-content', paddingRight: 30 }}>
            {categories.map((cat) => (
              <div key={cat.id} onClick={() => scrollToCategory(cat.id)} style={{ padding: '6px 12px', borderRadius: 16, fontSize: '0.8rem', cursor: 'pointer', background: activeCategory === cat.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)', border: activeCategory === cat.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.08)', color: activeCategory === cat.id ? '#6366f1' : 'rgba(255,255,255,0.6)' }}>
                {cat.icon} {cat.name}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 8, width: 40, background: 'linear-gradient(to right, transparent, #0f0f23)', pointerEvents: 'none' }} />
      </div>

      <div className="nav-layout" style={{ display: 'flex', gap: sidebarCollapsed ? 12 : 24 }}>
        {/* Sidebar */}
        <aside className="nav-sidebar" style={{ width: sidebarCollapsed ? 0 : 150, flexShrink: 0, position: 'sticky', top: 88, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.3s ease' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.1)', padding: '12px 0', width: 150 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
              <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {categories.map((cat) => (
                  <SortableCategoryItem key={cat.id} category={cat} isActive={activeCategory === cat.id} isEditing={isEditing} onClick={() => scrollToCategory(cat.id)} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 650, margin: '0 auto 20px' }}><SearchBar /></div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input placeholder="站内搜索..." prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} value={search} onChange={(e) => setSearch(e.target.value)} allowClear size="small" style={{ flex: 1, minWidth: 160, maxWidth: 260, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(99, 102, 241, 0.2)', borderRadius: 8 }} />
            <Button type={isEditing ? 'primary' : 'default'} icon={isEditing ? <CheckOutlined /> : <EditOutlined />} onClick={() => setIsEditing(!isEditing)} size="small">{isEditing ? '完成' : '编辑'}</Button>
            {isEditing && (<><Button icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)} size="small">添加</Button><Button size="small" onClick={handleReset}>恢复默认</Button></>)}
          </div>

          {/* Frequent sites */}
          {!search && frequentSites.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <FireOutlined style={{ fontSize: '1.1rem', marginRight: 6, color: '#f59e0b' }} />
                <Title level={5} style={{ margin: 0 }}>常用网站</Title>
                {isEditing && <Button size="small" danger style={{ marginLeft: 12 }} onClick={() => { localStorage.removeItem(CLICKS_KEY); setCategories([...categories]) }}>清除记录</Button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {frequentSites.map((site) => (
                  <Tooltip key={`freq-${site.id}`} title={site.desc}>
                    <motion.a href={site.url} target="_blank" rel="noopener noreferrer" onClick={() => recordClick(site.id)} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', textDecoration: 'none' }}>
                      <img src={`/favicons/${new URL(site.url).hostname.replace(/[^a-zA-Z0-9.]/g, '_')}.png`} alt="" style={{ width: 20, height: 20, borderRadius: 3 }} onError={(e) => { const img = e.target as HTMLImageElement; if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = `https://favicon.im/${new URL(site.url).hostname}` } else { img.style.display = 'none' } }} />
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{site.title}</span>
                    </motion.a>
                  </Tooltip>
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
                      <SortableSiteCard key={site.id} site={site} isEditing={isEditing} onDelete={() => handleDelete(category.id, site.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </section>
          ))}

          {filteredCategories.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>没有找到匹配的网站</div>}
        </main>
      </div>

      {/* Add modal */}
      <Modal title="添加网站" open={addModalOpen} onCancel={() => setAddModalOpen(false)} onOk={() => form.submit()} okText="添加" cancelText="取消">
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="title" label="网站名称" rules={[{ required: true, message: '请输入名称' }]}><Input placeholder="如：GitHub" /></Form.Item>
          <Form.Item name="url" label="网址" rules={[{ required: true, message: '请输入网址' }]}><Input placeholder="如：https://github.com" /></Form.Item>
          <Form.Item name="desc" label="描述" rules={[{ required: true, message: '请输入描述' }]}><Input placeholder="如：代码托管平台" /></Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="选择分类">{categories.map((cat) => (<Select.Option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</Select.Option>))}</Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NavigationPage
