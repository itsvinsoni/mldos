import React from 'react';
import { PlusIcon } from './Icons';

interface FloatingActionButtonProps {
  onClick: () => void;
  'aria-label': string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, 'aria-label': ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-20 right-4 lg:hidden w-14 h-14 bg-brand-orange-dark text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange-dark z-50"
    >
      <PlusIcon className="w-7 h-7" />
    </button>
  );
};

export default FloatingActionButton;
