
import React, { useEffect, useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { NotificationType } from '../types';

interface ToastProps {
  id: number;
  message: string;
  type: NotificationType;
}

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const context = useContext(NotificationContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      context?.removeNotification(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, context]);

  const baseClasses = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
  const typeClasses = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
    info: 'bg-blue-50 text-blue-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => context?.removeNotification(id)}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
