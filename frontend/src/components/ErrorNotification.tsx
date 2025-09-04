import { X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ErrorNotificationProps {
  message: string | null;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const { t } = useI18n();
  useEffect(() => {
    if (message && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">
              {t('common.error')}
            </p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-red-400 hover:text-red-500 focus:outline-none focus:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
