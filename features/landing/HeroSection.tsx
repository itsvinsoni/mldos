import React from 'react';

interface HeroSectionProps {
    navigate: (to: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
    const scrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-brand-text font-poppins leading-tight">
                    MLD — Schools & Colleges
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-light">
                    Future-ready education across 11–12 School, Nursing, DMLT, Ayurvedic, Pharmacy, and Veterinary programs.
                </p>
                <div className="mt-8 flex justify-center items-center space-x-4">
                    <a href="#programs" onClick={scrollToPrograms} className="px-8 py-3 text-base font-semibold text-white bg-brand-orange-dark rounded-lg hover:bg-opacity-90 transition-colors">
                        Explore Programs
                    </a>
                    <a href="/#/portal" onClick={(e) => handleNav(e, '/portal')} className="px-8 py-3 text-base font-semibold text-brand-orange-dark border border-brand-orange-dark rounded-lg hover:bg-brand-orange-light transition-colors">
                        Go to Portal
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;