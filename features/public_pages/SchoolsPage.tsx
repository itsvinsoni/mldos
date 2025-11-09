import React from 'react';
import LandingHeader from '../landing/LandingHeader';
import Footer from '../landing/Footer';

interface PageProps {
    navigate: (to: string) => void;
}

const SchoolsPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
            <LandingHeader navigate={navigate} />
            <main className="container mx-auto px-4 sm:px-6 py-16">
                <div className="bg-white p-8 rounded-2xl shadow-subtle">
                    <h1 className="text-3xl font-bold text-brand-text font-poppins mb-4">Our Schools (11-12)</h1>
                    <p className="text-brand-text-light leading-relaxed">
                        This page will provide details about the senior secondary school programs, curriculum, and facilities offered by the MLD School of Excellence.
                    </p>
                </div>
            </main>
            <Footer navigate={navigate} />
        </div>
    );
};

export default SchoolsPage;
