import React from 'react';

interface CardProps {
  title: string;
  value: string;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-subtle flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-brand-text-light">{title}</p>
        <p className="text-3xl font-bold text-brand-text mt-1">{value}</p>
      </div>
      <div className="bg-brand-orange-light p-3 rounded-xl">
        <div className="h-6 w-6 text-brand-orange-dark">
            {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
