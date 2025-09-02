import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '../contexts/ThemeContext'
import MermaidRenderer from './MermaidRenderer'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [showPreview, setShowPreview] = useState(true)
  const { theme } = useTheme()

  const insertText = useCallback(
    (before: string, after: string = '') => {
      const textarea = document.getElementById(
        'markdown-textarea'
      ) as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end)

      onChange(newText)

      // 重新设置光标位置
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, end + before.length)
      }, 0)
    },
    [value, onChange]
  )

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: '粗体' },
    { icon: Italic, action: () => insertText('*', '*'), title: '斜体' },
    { icon: Heading1, action: () => insertText('# '), title: '标题 1' },
    { icon: Heading2, action: () => insertText('## '), title: '标题 2' },
    { icon: Heading3, action: () => insertText('### '), title: '标题 3' },
    { icon: List, action: () => insertText('- '), title: '无序列表' },
    { icon: ListOrdered, action: () => insertText('1. '), title: '有序列表' },
    { icon: Quote, action: () => insertText('> '), title: '引用' },
    { icon: Code, action: () => insertText('`', '`'), title: '行内代码' },
    { icon: LinkIcon, action: () => insertText('[', '](url)'), title: '链接' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              title={button.title}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <button.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          {showPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{showPreview ? '隐藏预览' : '显示预览'}</span>
        </button>
      </div>

      {/* 编辑器内容区域 */}
      <div className="flex-1 flex">
        {/* 编辑区 */}
        <div
          className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200 dark:border-gray-700`}
        >
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '开始写作...'}
            className="w-full h-full p-4 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            style={{ minHeight: 'calc(100vh - 200px)' }}
          />
        </div>

        {/* 预览区 */}
        {showPreview && (
          <div className="w-1/2 overflow-auto bg-white dark:bg-gray-800">
            <div className="p-4 markdown-preview prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : ''
                    const code = String(children).replace(/\n$/, '')

                    if (!inline && language === 'mermaid') {
                      return (
                        <MermaidRenderer
                          chart={code}
                          id={`mermaid-${Math.random().toString(36).substr(2, 9)}`}
                        />
                      )
                    }

                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={theme === 'dark' ? oneDark : oneLight}
                        language={language}
                        PreTag="div"
                        {...props}
                      >
                        {code}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {value || '预览区域'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
