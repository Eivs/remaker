import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { articlesAPI } from '../services/api'
import MarkdownEditor from '../components/MarkdownEditor'
import { Save, Globe, EyeOff } from 'lucide-react'
import type { Article } from '../types'

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [article, setArticle] = useState<Article | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (id) {
      loadArticle(parseInt(id))
    }
  }, [id])

  const loadArticle = async (articleId: number) => {
    try {
      const articleData = await articlesAPI.getArticle(articleId)
      setArticle(articleData)
      setTitle(articleData.title)
      setContent(articleData.content)
    } catch (error: any) {
      console.error('Failed to load article:', error)
      navigate('/')
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveMessage('请填写标题和内容')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      if (article) {
        // 更新现有文章
        const updatedArticle = await articlesAPI.updateArticle(article.id, {
          title: title.trim(),
          content: content.trim(),
        })
        setArticle(updatedArticle)
        setSaveMessage('保存成功')
      } else {
        // 创建新文章
        const newArticle = await articlesAPI.createArticle({
          title: title.trim(),
          content: content.trim(),
        })
        setArticle(newArticle)
        setSaveMessage('创建成功')
        navigate(`/editor/${newArticle.id}`)
      }
    } catch (error: any) {
      setSaveMessage(
        '保存失败：' + (error.response?.data?.detail || error.message)
      )
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handlePublish = async () => {
    if (!article) {
      setSaveMessage('请先保存文章')
      return
    }

    setIsPublishing(true)
    setSaveMessage('')

    try {
      if (article.is_published) {
        await articlesAPI.unpublishArticle(article.id)
        setArticle({ ...article, is_published: false })
        setSaveMessage('已取消发布')
      } else {
        await articlesAPI.publishArticle(article.id)
        setArticle({ ...article, is_published: true })
        setSaveMessage('发布成功')
      }
    } catch (error: any) {
      setSaveMessage(
        '操作失败：' + (error.response?.data?.detail || error.message)
      )
    } finally {
      setIsPublishing(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* 顶部工具栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题..."
              className="w-full text-xl font-semibold border-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span
                className={`text-sm ${saveMessage.includes('失败') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
              >
                {saveMessage}
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? '保存中...' : '保存'}</span>
            </button>

            {article && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  article.is_published
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {article.is_published ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                <span>
                  {isPublishing
                    ? '处理中...'
                    : article.is_published
                      ? '取消发布'
                      : '发布'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div className="flex-1">
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="开始编写你的 Markdown 内容..."
        />
      </div>
    </div>
  )
}

export default Editor
