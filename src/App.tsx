import { ConfigProvider, theme } from 'antd'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/Home'
import ToolsPage from './pages/Tools'
import ProjectsPage from './pages/Projects'
import AboutPage from './pages/About'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout isDark={isDark} toggleTheme={toggleTheme} />}>
            <Route index element={<HomePage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
