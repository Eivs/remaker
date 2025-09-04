import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { tagsAPI } from '../services/api';
import type { Tag } from '../types';
import TagBadge from './TagBadge';

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
}) => {
  const { t } = useI18n();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTags = async () => {
    try {
      const tags = await tagsAPI.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const filteredTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTags.some((selected) => selected.id === tag.id)
  );

  const handleTagSelect = (tag: Tag) => {
    onChange([...selectedTags, tag]);
    setSearchTerm('');
  };

  const handleTagRemove = (tag: Tag) => {
    onChange(selectedTags.filter((selected) => selected.id !== tag.id));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await tagsAPI.createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setAllTags([...allTags, newTag]);
      onChange([...selectedTags, newTag]);
      setNewTagName('');
      setNewTagColor('#3B82F6');
      setIsCreating(false);
    } catch (error) {
      console.error(t('tags.loadFailed'), error);
      alert(t('tags.createFailed'));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('tags.label')}
      </label>

      {/* 已选择的标签 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            removable
            onRemove={handleTagRemove}
          />
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={t('tags.searchPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* 下拉菜单 */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {isCreating ? (
              // 创建新标签界面
              <div className="p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder={t('tags.tagName')}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    {t('tags.create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setNewTagName('');
                      setNewTagColor('#3B82F6');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    {t('tags.cancel')}
                  </button>
                </div>
              </div>
            ) : (
              // 搜索结果和创建按钮
              <>
                {filteredTags.length > 0 && (
                  <div className="p-2">
                    {filteredTags.map((tag) => (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => handleTagSelect(tag)}
                        className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <TagBadge tag={tag} size="sm" />
                      </button>
                    ))}
                  </div>
                )}

                {searchTerm &&
                  !filteredTags.some(
                    (tag) => tag.name.toLowerCase() === searchTerm.toLowerCase()
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewTagName(searchTerm);
                        setIsCreating(true);
                      }}
                      className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 border-t"
                    >
                      {t('tags.createTag')} "{searchTerm}"
                    </button>
                  )}

                {!searchTerm && (
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 border-t"
                  >
                    {t('tags.createNew')}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
