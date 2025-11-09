import React from 'react';
import LandingHeader from '../landing/LandingHeader';
import Footer from '../landing/Footer';

interface PageProps {
    navigate: (to: string) => void;
}

const AdmissionsPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
            <LandingHeader navigate={navigate} />
            <main className="container mx-auto px-4 sm:px-6 py-16">
                <div className="bg-white p-8 rounded-2xl shadow-subtle">
                    <h1 className="text-3xl font-bold text-brand-text font-poppins mb-4">Admissions</h1>
                    <p className="text-brand-text-light leading-relaxed">
                        Details about the admission process, eligibility criteria, and important dates will be available here. The "Apply Now" button would lead to a form or further instructions on this page.
                    </p>
                </div>
            </main>
            <Footer navigate={navigate} />
        </div>
    );
};

export default AdmissionsPage;
