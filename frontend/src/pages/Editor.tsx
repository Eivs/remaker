import { EyeOff, Globe, Save } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';
import TagSelector from '../components/TagSelector';
import { useI18n } from '../contexts/I18nContext';
import { articlesAPI } from '../services/api';
import type { Article, Tag } from '../types';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle(parseInt(id));
    }
  }, [id]);

  const loadArticle = async (articleId: number) => {
    try {
      const articleData = await articlesAPI.getArticle(articleId);
      setArticle(articleData);
      setTitle(articleData.title);
      setContent(articleData.content);
      setSelectedTags(articleData.tags || []);
    } catch (error: any) {
      console.error('Failed to load article:', error);
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveMessage(t('editor.requiredFields'));
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const tagIds = selectedTags.map((tag) => tag.id);

      if (article) {
        // 更新现有文章
        const updatedArticle = await articlesAPI.updateArticle(article.id, {
          title: title.trim(),
          content: content.trim(),
          tag_ids: tagIds,
        });
        setArticle(updatedArticle);
        setSelectedTags(updatedArticle.tags || []);
        setSaveMessage(t('editor.updateSuccess'));
      } else {
        // 创建新文章
        const newArticle = await articlesAPI.createArticle({
          title: title.trim(),
          content: content.trim(),
          tag_ids: tagIds,
        });
        setArticle(newArticle);
        setSelectedTags(newArticle.tags || []);
        setSaveMessage(t('editor.createSuccess'));
        navigate(`/editor/${newArticle.id}`);
      }
    } catch (error: any) {
      setSaveMessage(
        t('editor.saveFailed') + (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handlePublish = async () => {
    if (!article) {
      setSaveMessage(t('editor.saveFirst'));
      return;
    }

    setIsPublishing(true);
    setSaveMessage('');

    try {
      if (article.is_published) {
        await articlesAPI.unpublishArticle(article.id);
        setArticle({ ...article, is_published: false });
        setSaveMessage(t('editor.unpublishSuccess'));
      } else {
        await articlesAPI.publishArticle(article.id);
        setArticle({ ...article, is_published: true });
        setSaveMessage(t('editor.publishSuccess'));
      }
    } catch (error: any) {
      setSaveMessage(
        t('editor.operationFailed') +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsPublishing(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* 顶部工具栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('editor.titlePlaceholder')}
              className="w-full text-xl font-semibold border-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            {saveMessage && (
              <span
                className={`text-sm ${saveMessage.includes(t('common.failed')) ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
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
              <span>{isSaving ? t('editor.saving') : t('editor.save')}</span>
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
                    ? t('editor.publishing')
                    : article.is_published
                      ? t('editor.unpublish')
                      : t('editor.publish')}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 标签选择器 */}
        <div className="max-w-md">
          <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div className="flex-1">
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder={t('editor.contentPlaceholder')}
        />
      </div>
    </div>
  );
};

export default Editor;
