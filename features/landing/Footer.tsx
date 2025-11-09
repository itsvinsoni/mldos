import React from 'react';
import { CollegeIcon } from '../../components/Icons';

interface FooterProps {
    navigate: (to: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <footer className="bg-brand-text">
            <div className="container mx-auto px-4 sm:px-6 py-12 text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="bg-brand-orange-light p-2 rounded-lg">
                                <CollegeIcon className="h-6 w-6 text-brand-orange-dark" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-white font-poppins">MLD</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Empowering future generations with quality education and values.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="/#/about" onClick={(e) => handleNav(e, '/about')} className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="/#/admissions" onClick={(e) => handleNav(e, '/admissions')} className="text-gray-400 hover:text-white">Admissions</a></li>
                            <li><a href="/#/contact" onClick={(e) => handleNav(e, '/contact')} className="text-gray-400 hover:text-white">Contact Us</a></li>
                            <li><a href="/#/portal" onClick={(e) => handleNav(e, '/portal')} className="text-gray-400 hover:text-white">Portal Login</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Contact</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-400">
                           <li>Main Campus, Cityville</li>
                           <li>contact@mld.edu</li>
                           <li>+91 123 456 7890</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white tracking-wider uppercase">Legal</h3>
                         <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="/#/privacy" onClick={(e) => handleNav(e, '/privacy')} className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                            <li><a href="/#/csr" onClick={(e) => handleNav(e, '/csr')} className="text-gray-400 hover:text-white">CSR</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} MLD Group of Institutions. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;