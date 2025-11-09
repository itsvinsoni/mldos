import React from 'react';
import { MoreVerticalIcon } from './Icons';

interface MobileCardProps {
    children: React.ReactNode;
}

const MobileCard: React.FC<MobileCardProps> = ({ children }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-subtle relative">
            <div className="absolute top-2 right-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="w-5 h-5" />
                </button>
            </div>
            {children}
        </div>
    );
};

export default MobileCard;
