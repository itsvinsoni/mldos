import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import ProgramsSection from './ProgramsSection';
import NoticesSection from './NoticesSection';
import Footer from './Footer';

interface LandingPageProps {
    navigate: (to: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
      <LandingHeader navigate={navigate} />
      <main>
        <HeroSection navigate={navigate} />
        <ProgramsSection />
        <NoticesSection navigate={navigate} />
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default LandingPage;