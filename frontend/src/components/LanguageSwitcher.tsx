import { Languages } from 'lucide-react';
import type React from 'react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-mono">
        {language === 'zh' ? '中' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
