import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translation = {
  en: {
    'app.title': 'Markdown Editor',
    'app.description': 'A full-stack Markdown editor application',
    'nav.dashboard': 'Dashboard',
    'nav.editor': 'Editor',
    'nav.articles': 'Public Articles',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'login.title': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.noAccount': "Don't have an account? Register",
    'register.title': 'Register',
    'register.username': 'Username',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.submit': 'Register',
    'register.hasAccount': 'Already have an account? Login',
    'register.passwordMismatch': 'Password confirmation does not match',
    'register.registering': 'Registering...',
    'register.usernamePlaceholder': 'Enter username',
    'register.emailPlaceholder': 'Enter email',
    'register.passwordPlaceholder': 'Enter password',
    'register.confirmPasswordPlaceholder': 'Enter password again',
    'editor.title': 'Markdown Editor',
    'editor.content': 'Content',
    'editor.preview': 'Preview',
    'editor.save': 'Save',
    'editor.publish': 'Publish',
    'editor.saved': 'Saved successfully',
    'editor.published': 'Published successfully',
    'dashboard.title': 'My Articles',
    'dashboard.createNew': 'Create New Article',
    'dashboard.noArticles': 'No articles yet',
    'dashboard.edit': 'Edit',
    'dashboard.delete': 'Delete',
    'dashboard.confirmDelete': 'Are you sure you want to delete this article?',
    'articles.title': 'Public Articles',
    'articles.noArticles': 'No public articles yet',
    'articles.by': 'by',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.welcome': 'Welcome',
    'common.toggleTheme': 'Toggle theme',
    'language.en': 'English',
    'language.zh': '中文',
    // Editor page
    'editor.titlePlaceholder': 'Enter article title...',
    'editor.contentPlaceholder': 'Start writing your Markdown content...',
    'editor.saving': 'Saving...',
    'editor.publishing': 'Processing...',
    'editor.unpublish': 'Unpublish',
    'editor.requiredFields': 'Please fill in title and content',
    'editor.saveFirst': 'Please save the article first',
    'editor.updateSuccess': 'Saved successfully',
    'editor.createSuccess': 'Created successfully',
    'editor.publishSuccess': 'Published successfully',
    'editor.unpublishSuccess': 'Unpublished',
    'editor.saveFailed': 'Save failed: ',
    'editor.operationFailed': 'Operation failed: ',
    // Dashboard page
    'dashboard.writeNew': 'Write New Article',
    'dashboard.loadFailed': 'Failed to load articles: ',
    'dashboard.deleteFailed': 'Delete failed: ',
    'dashboard.noArticlesYet': 'No articles yet',
    'dashboard.createFirst': 'Start creating your first Markdown article!',
    'dashboard.createdAt': 'Created at ',
    'dashboard.updatedAt': ' • Updated at ',
    'dashboard.published': 'Published',
    'dashboard.draft': 'Draft',
    'dashboard.edit': 'Edit',
    'dashboard.delete': 'Delete',
    // PublicArticles page
    'public.title': 'Public Articles',
    'public.subtitle': 'Browse all published Markdown articles',
    'public.backToList': 'Back to article list',
    'public.publishedStatus': 'Published',
    'public.noPublicArticles': 'No public articles yet',
    'public.waitingContent':
      'Waiting for other users to publish great content!',
    'public.loadFailed': 'Failed to load articles: ',
    // MarkdownEditor
    'editor.bold': 'Bold',
    'editor.italic': 'Italic',
    'editor.heading1': 'Heading 1',
    'editor.heading2': 'Heading 2',
    'editor.heading3': 'Heading 3',
    'editor.unorderedList': 'Unordered List',
    'editor.orderedList': 'Ordered List',
    'editor.quote': 'Quote',
    'editor.inlineCode': 'Inline Code',
    'editor.link': 'Link',
    'editor.hidePreview': 'Hide Preview',
    'editor.showPreview': 'Show Preview',
    'editor.startWriting': 'Start writing...',
    'editor.previewArea': 'Preview Area',
    // TagFilter
    'tags.loading': 'Loading tags...',
    'tags.filterByTag': 'Filter by tag',
    'tags.clearFilter': 'Clear filter',
    'tags.loadFailed': 'Failed to load tags: ',
    // TagSelector
    'tags.label': 'Tags',
    'tags.searchPlaceholder': 'Search or add tags...',
    'tags.tagName': 'Tag name',
    'tags.create': 'Create',
    'tags.cancel': 'Cancel',
    'tags.createTag': 'Create tag',
    'tags.createNew': '+ Create new tag',
    'tags.createFailed': 'Failed to create tag, it might already exist',
    // MermaidRenderer
    'mermaid.renderError': 'Mermaid chart rendering error: ',
    // Auth errors
    'auth.loginFailed': 'Login failed',
    'auth.registerFailed': 'Registration failed',
    // Common messages
    'common.failed': 'failed',
    'dashboard.backToList': 'Back to article list',
  },
  zh: {
    'app.title': 'Markdown 编辑器',
    'app.description': '一个全栈 Markdown 编辑器应用',
    'nav.dashboard': '仪表板',
    'nav.editor': '编辑器',
    'nav.articles': '公开文章',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.logout': '退出',
    'login.title': '登录',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.submit': '登录',
    'login.noAccount': '没有账号？注册',
    'register.title': '注册',
    'register.username': '用户名',
    'register.email': '邮箱',
    'register.password': '密码',
    'register.confirmPassword': '确认密码',
    'register.submit': '注册',
    'register.hasAccount': '已有账号？登录',
    'register.passwordMismatch': '密码确认不匹配',
    'register.registering': '注册中...',
    'register.usernamePlaceholder': '请输入用户名',
    'register.emailPlaceholder': '请输入邮箱',
    'register.passwordPlaceholder': '请输入密码',
    'register.confirmPasswordPlaceholder': '请再次输入密码',
    'editor.title': 'Markdown 编辑器',
    'editor.content': '内容',
    'editor.preview': '预览',
    'editor.save': '保存',
    'editor.publish': '发布',
    'editor.saved': '保存成功',
    'editor.published': '发布成功',
    'dashboard.title': '我的文章',
    'dashboard.createNew': '创建新文章',
    'dashboard.noArticles': '暂无文章',
    'dashboard.edit': '编辑',
    'dashboard.delete': '删除',
    'dashboard.confirmDelete': '确定要删除这篇文章吗？',
    'articles.title': '公开文章',
    'articles.noArticles': '暂无公开文章',
    'articles.by': '作者：',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.welcome': '欢迎',
    'common.toggleTheme': '切换主题',
    'language.en': 'English',
    'language.zh': '中文',
    // Editor page
    'editor.titlePlaceholder': '请输入文章标题...',
    'editor.contentPlaceholder': '开始编写你的 Markdown 内容...',
    'editor.saving': '保存中...',
    'editor.publishing': '处理中...',
    'editor.unpublish': '取消发布',
    'editor.requiredFields': '请填写标题和内容',
    'editor.saveFirst': '请先保存文章',
    'editor.updateSuccess': '保存成功',
    'editor.createSuccess': '创建成功',
    'editor.publishSuccess': '发布成功',
    'editor.unpublishSuccess': '已取消发布',
    'editor.saveFailed': '保存失败：',
    'editor.operationFailed': '操作失败：',
    // Dashboard page
    'dashboard.writeNew': '写新文章',
    'dashboard.loadFailed': '加载文章失败：',
    'dashboard.deleteFailed': '删除失败：',
    'dashboard.noArticlesYet': '还没有文章',
    'dashboard.createFirst': '开始创建你的第一篇 Markdown 文章吧！',
    'dashboard.createdAt': '创建于 ',
    'dashboard.updatedAt': ' • 更新于 ',
    'dashboard.published': '已发布',
    'dashboard.draft': '草稿',
    'dashboard.edit': '编辑',
    'dashboard.delete': '删除',
    // PublicArticles page
    'public.title': '公开文章',
    'public.subtitle': '浏览所有用户发布的 Markdown 文章',
    'public.backToList': '返回文章列表',
    'public.publishedStatus': '已发布',
    'public.noPublicArticles': '暂无公开文章',
    'public.waitingContent': '等待其他用户发布精彩内容！',
    'public.loadFailed': '加载文章失败：',
    // MarkdownEditor
    'editor.bold': '粗体',
    'editor.italic': '斜体',
    'editor.heading1': '标题 1',
    'editor.heading2': '标题 2',
    'editor.heading3': '标题 3',
    'editor.unorderedList': '无序列表',
    'editor.orderedList': '有序列表',
    'editor.quote': '引用',
    'editor.inlineCode': '行内代码',
    'editor.link': '链接',
    'editor.hidePreview': '隐藏预览',
    'editor.showPreview': '显示预览',
    'editor.startWriting': '开始写作...',
    'editor.previewArea': '预览区域',
    // TagFilter
    'tags.loading': '加载标签中...',
    'tags.filterByTag': '按标签筛选',
    'tags.clearFilter': '清除筛选',
    'tags.loadFailed': '加载标签失败：',
    // TagSelector
    'tags.label': '标签',
    'tags.searchPlaceholder': '搜索或添加标签...',
    'tags.tagName': '标签名称',
    'tags.create': '创建',
    'tags.cancel': '取消',
    'tags.createTag': '创建标签',
    'tags.createNew': '+ 创建新标签',
    'tags.createFailed': '创建标签失败，可能该标签已存在',
    // MermaidRenderer
    'mermaid.renderError': 'Mermaid 图表渲染错误: ',
    // Auth errors
    'auth.loginFailed': '登录失败',
    'auth.registerFailed': '注册失败',
    // Common messages
    'common.failed': '失败',
    'dashboard.backToList': '返回文章列表',
  },
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
