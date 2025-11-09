import React, { useState, useEffect, useMemo } from 'react';
import { Program } from '../../types';
import * as api from '../../services/localApi';
import { CourseIcon } from '../../components/Icons';

const ProgramCard: React.FC<{ program: Program }> = ({ program }) => (
    <div className="bg-white p-6 rounded-2xl shadow-subtle flex flex-col justify-between hover:shadow-lg transition-shadow">
        <div>
            <div className="bg-brand-orange-light p-3 rounded-xl w-max mb-4">
                <CourseIcon className="h-6 w-6 text-brand-orange-dark" />
            </div>
            <h3 className="font-bold text-lg text-brand-text mb-1">{program.name}</h3>
            <p className="text-sm text-brand-text-light">{program.duration}</p>
        </div>
        <div className="mt-4 flex items-center space-x-2">
            <a href="#" className="w-full text-center px-4 py-2 bg-brand-orange-light text-brand-orange-dark rounded-lg font-semibold hover:bg-orange-200 transition-colors text-sm">
                View Details
            </a>
            <a href="#" className="w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">
                Syllabus
            </a>
        </div>
    </div>
);

const ProgramSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-subtle animate-pulse">
        <div className="bg-gray-200 p-3 rounded-xl w-12 h-12 mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex items-center space-x-2">
            <div className="h-9 bg-gray-200 rounded w-full"></div>
            <div className="h-9 bg-gray-200 rounded w-full"></div>
        </div>
    </div>
);

const ProgramsSection: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'School' | 'College'>('College');

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true);
            const publicPrograms = await api.getPublicPrograms();
            setPrograms(publicPrograms);
            setLoading(false);
        };
        fetchPrograms();
    }, []);
    
    const filteredPrograms = useMemo(() => {
        return programs.filter(p => p.category === activeFilter);
    }, [programs, activeFilter]);

    return (
        <section id="programs" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-text font-poppins">Our Programs</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-brand-text-light">Discover the path that's right for you.</p>
                </div>

                <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                    <button 
                        onClick={() => setActiveFilter('College')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeFilter === 'College' ? 'bg-brand-orange-dark text-white' : 'bg-white text-brand-text'}`}
                    >
                        Colleges
                    </button>
                    <button 
                        onClick={() => setActiveFilter('School')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeFilter === 'School' ? 'bg-brand-orange-dark text-white' : 'bg-white text-brand-text'}`}
                    >
                        Schools (11-12)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => <ProgramSkeleton key={i} />)
                    ) : (
                        filteredPrograms.map(program => <ProgramCard key={program.id} program={program} />)
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProgramsSection;