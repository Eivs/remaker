import type React from 'react';
import { useEffect, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { tagsAPI } from '../services/api';
import type { Tag } from '../types';
import TagBadge from './TagBadge';

interface TagFilterProps {
  selectedTagId?: number;
  onTagSelect: (tagId?: number) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTagId,
  onTagSelect,
}) => {
  const { t } = useI18n();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await tagsAPI.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error(t('tags.loadFailed'), error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag: Tag) => {
    if (selectedTagId === tag.id) {
      onTagSelect(undefined); // 取消选择
    } else {
      onTagSelect(tag.id);
    }
  };

  const handleClearFilter = () => {
    onTagSelect(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{t('tags.loading')}</span>
      </div>
    );
  }

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {t('tags.filterByTag')}
        </h3>
        {selectedTagId && (
          <button
            type="button"
            onClick={handleClearFilter}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {t('tags.clearFilter')}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => handleTagClick(tag)}
            className={`
              transition-all duration-200
              ${selectedTagId === tag.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
            `}
          >
            <TagBadge
              tag={tag}
              size="sm"
              onClick={() => {}} // 空函数，因为点击由外层 button 处理
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
