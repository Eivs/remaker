import { ArrowLeft, Clock, Globe, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import TagBadge from '../components/TagBadge';
import TagFilter from '../components/TagFilter';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { articlesAPI } from '../services/api';
import type { Article } from '../types';

const PublicArticles: React.FC = () => {
  const { t } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [error, setError] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>();
  const { theme } = useTheme();

  useEffect(() => {
    loadPublicArticles();
  }, [selectedTagId]);

  const loadPublicArticles = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await articlesAPI.getPublicArticles(selectedTagId);
      setArticles(data);
    } catch (err: any) {
      setError(
        t('public.loadFailed') + (err.response?.data?.detail || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullArticle = async (articleId: number) => {
    try {
      setIsLoadingArticle(true);
      setError('');
      const fullArticle = await articlesAPI.getArticle(articleId);
      setSelectedArticle(fullArticle);
    } catch (err: any) {
      setError(
        t('public.loadFailed') + (err.response?.data?.detail || err.message)
      );
    } finally {
      setIsLoadingArticle(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 文章详情视图
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('public.backToList')}</span>
        </button>

        {isLoadingArticle ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedArticle.author.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(selectedArticle.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>{t('public.publishedStatus')}</span>
                </div>
              </div>

              {/* 显示文章标签 */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} size="sm" />
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-6">
              <div className="markdown-preview prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={theme === 'dark' ? oneDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {selectedArticle.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        )}
      </div>
    );
  }

  // 文章列表视图
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('public.title')}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('public.subtitle')}
        </p>
      </div>

      {/* 标签筛选器 */}
      <div className="mb-6">
        <TagFilter
          selectedTagId={selectedTagId}
          onTagSelect={setSelectedTagId}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 mb-6">
          <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('public.noPublicArticles')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('public.waitingContent')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md dark:hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => loadFullArticle(article.id)}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                  {(article.content || '').substring(0, 150)}...
                </p>

                {/* 显示文章标签 */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <TagBadge key={tag.id} tag={tag} size="sm" />
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.author.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicArticles;
