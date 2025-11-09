import React, { useState, useEffect, useMemo } from 'react';
import { Notice } from '../../types';
import * as api from '../../services/localApi';
import { ReportIcon } from '../../components/Icons';

const NoticeItem: React.FC<{ notice: Notice }> = ({ notice }) => {
    const categoryColor = {
        Exams: 'bg-red-100 text-red-800',
        Admissions: 'bg-blue-100 text-blue-800',
        Events: 'bg-green-100 text-green-800',
        General: 'bg-gray-100 text-gray-800'
    };

    return (
        <li className="p-4 bg-white rounded-lg shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-2 sm:mb-0">
                <div className="flex items-center mb-1">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full mr-2 ${categoryColor[notice.category]}`}>
                        {notice.category}
                    </span>
                    <h3 className="font-semibold text-brand-text">{notice.title}</h3>
                </div>
                <p className="text-sm text-brand-text-light">{notice.description}</p>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-4">
                 <span className="text-xs text-gray-400">{notice.date}</span>
                 <a href="#" className="px-3 py-1 text-sm font-semibold text-brand-orange-dark border border-brand-orange-dark rounded-lg hover:bg-brand-orange-light transition-colors">
                    PDF
                 </a>
            </div>
        </li>
    );
};

const NoticeSkeleton: React.FC = () => (
    <li className="p-4 bg-white rounded-lg shadow-subtle animate-pulse">
        <div className="flex justify-between items-center">
            <div className="w-full">
                <div className="flex items-center mb-2">
                    <div className="h-4 bg-gray-200 rounded w-16 mr-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-12 ml-4"></div>
        </div>
    </li>
);


const NoticesSection: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            const publicNotices = await api.getPublicNotices();
            setNotices(publicNotices.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setLoading(false);
        };
        fetchNotices();
    }, []);

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-text font-poppins">Announcements & Exams</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-brand-text-light">Stay updated with the latest news and schedules.</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <ul className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <NoticeSkeleton key={i} />)
                        ) : (
                            notices.slice(0, 5).map(notice => <NoticeItem key={notice.id} notice={notice} />)
                        )}
                    </ul>
                </div>

                <div className="text-center mt-8">
                    <button onClick={() => navigate('/notices')} className="font-semibold text-brand-orange-dark hover:underline">
                        View all notices
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NoticesSection;