import React from 'react';
import LandingHeader from '../landing/LandingHeader';
import Footer from '../landing/Footer';
import NoticesSection from '../landing/NoticesSection';

interface PageProps {
    navigate: (to: string) => void;
}

const NoticesListPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
            <LandingHeader navigate={navigate} />
            <main>
                {/* A more detailed, paginated, and searchable notice list would go here. */}
                {/* For now, we reuse the NoticesSection for demonstration. */}
                <div className="py-16">
                    <NoticesSection navigate={navigate} />
                </div>
            </main>
            <Footer navigate={navigate} />
        </div>
    );
};

export default NoticesListPage;
