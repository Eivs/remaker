import type React from 'react';
import type { Tag } from '../types';

interface TagBadgeProps {
  tag: Tag;
  size?: 'sm' | 'md';
  removable?: boolean;
  onClick?: (tag: Tag) => void;
  onRemove?: (tag: Tag) => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  size = 'md',
  removable = false,
  onClick,
  onRemove,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const handleClick = () => {
    if (onClick && !removable) {
      onClick(tag);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size]}
        ${onClick && !removable ? 'cursor-pointer hover:opacity-80' : ''}
      `}
      style={{
        backgroundColor: tag.color + '20',
        color: tag.color,
        border: `1px solid ${tag.color}30`,
      }}
      onClick={handleClick}
    >
      {tag.name}
      {removable && (
        <button
          type="button"
          className="ml-1 p-0.5 rounded-full hover:bg-black hover:bg-opacity-10"
          onClick={handleRemove}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default TagBadge;
