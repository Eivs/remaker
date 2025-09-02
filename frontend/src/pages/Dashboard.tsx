import { Clock, Edit, Eye, Globe, PenTool, Trash2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import type { Article } from '../types';

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await articlesAPI.getUserArticles();
      setArticles(data);
    } catch (err: any) {
      setError('加载文章失败：' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      await articlesAPI.deleteArticle(id);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err: any) {
      setError('删除失败：' + (err.response?.data?.detail || err.message));
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          我的文章
        </h1>
        <Link
          to="/editor"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PenTool className="h-4 w-4" />
          <span>写新文章</span>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 mb-6">
          <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <PenTool className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            还没有文章
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            开始创建你的第一篇 Markdown 文章吧！
          </p>
          <div className="mt-6">
            <Link
              to="/editor"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PenTool className="-ml-1 mr-2 h-5 w-5" />
              写新文章
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/editor/${article.id}`}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded p-2 -m-2"
                      >
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                          {article.title}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          创建于 {formatDate(article.created_at)}
                          {article.updated_at &&
                            ` • 更新于 ${formatDate(article.updated_at)}`}
                        </p>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {article.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                          <Globe className="h-3 w-3 mr-1" />
                          已发布
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300">
                          <Eye className="h-3 w-3 mr-1" />
                          草稿
                        </span>
                      )}

                      <Link
                        to={`/editor/${article.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
