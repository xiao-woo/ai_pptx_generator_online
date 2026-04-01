import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-500',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700',
    },
    error: {
      container: 'bg-red-50 border-red-500',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-500',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-500',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-700',
    },
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const style = styles[type];

  return (
    <div
      className={clsx(
        'border-l-4 p-4 rounded',
        style.container,
        className
      )}
    >
      <div className="flex items-start">
        <div className={clsx('flex-shrink-0', style.icon)}>
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('text-sm font-medium', style.title)}>
              {title}
            </h3>
          )}
          <div className={clsx('text-sm', style.message)}>
            {message}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx(
              'ml-3 flex-shrink-0',
              style.icon,
              'hover:opacity-70 transition-opacity'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
