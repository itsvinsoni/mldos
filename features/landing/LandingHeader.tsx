import React from 'react';
import { CollegeIcon } from '../../components/Icons';

interface LandingHeaderProps {
    navigate: (to: string) => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ navigate }) => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Schools', path: '/schools' },
        { name: 'Colleges', path: '/colleges' },
        { name: 'Admissions', path: '/admissions' },
        { name: 'Notices', path: '/notices' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <a href="/#/" onClick={(e) => handleNav(e, '/')} className="flex items-center">
                    <div className="bg-brand-orange-light p-2 rounded-lg">
                        <CollegeIcon className="h-6 w-6 text-brand-orange-dark" />
                    </div>
                    <span className="ml-3 text-xl font-bold text-brand-text font-poppins">MLD</span>
                </a>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <a key={link.name} href={`/#${link.path}`} onClick={(e) => handleNav(e, link.path)} className="text-sm font-medium text-brand-text-light hover:text-brand-text transition-colors">
                            {link.name}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center space-x-2">
                    <a href="/#/admissions" onClick={(e) => handleNav(e, '/admissions')} className="px-4 py-2 text-sm font-semibold text-brand-orange-dark border border-brand-orange-dark rounded-lg hover:bg-brand-orange-light transition-colors">
                        Apply Now
                    </a>
                    <a href="/#/portal" onClick={(e) => handleNav(e, '/portal')} className="px-4 py-2 text-sm font-semibold text-white bg-brand-orange-dark rounded-lg hover:bg-opacity-90 transition-colors">
                        Login
                    </a>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;