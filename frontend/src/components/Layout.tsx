import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { LogOut, PenTool, Home, Globe, Sun, Moon } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {!isAuthPage && (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
                >
                  <PenTool className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span>Markdown Editor</span>
                </Link>

                {user && (
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      <span>我的文章</span>
                    </Link>
                    <Link
                      to="/editor"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/editor')
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <PenTool className="h-4 w-4" />
                      <span>写文章</span>
                    </Link>
                    <Link
                      to="/public"
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/public'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      <span>公开文章</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* 主题切换按钮 */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="切换主题"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>

                {user && (
                  <>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      欢迎，{user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={isAuthPage ? 'dark:bg-gray-900 min-h-screen' : 'py-6'}>
        {children}
      </main>
    </div>
  )
}

export default Layout
