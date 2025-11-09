import React from 'react';
import { PlusIcon, ReportIcon } from './Icons'; // Using ReportIcon as a generic document icon

interface EmptyStateProps {
    title: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, action }) => {
    return (
        <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-subtle border-2 border-dashed border-gray-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange-light">
                <ReportIcon className="h-6 w-6 text-brand-orange-dark" />
            </div>
            <h3 className="mt-5 text-lg font-medium text-brand-text">{title}</h3>
            <p className="mt-2 text-sm text-brand-text-light">{message}</p>
            {action && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={action.onClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange-dark"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        {action.label}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;