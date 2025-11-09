
import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    return null; // or handle error
  }

  const { notifications } = context;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          id={notification.id}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
