import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CollegeOSApp from './CollegeOSApp';
import LandingPage from './features/landing/LandingPage';
import AboutPage from './features/public_pages/AboutPage';
import AdmissionsPage from './features/public_pages/AdmissionsPage';
import CollegesPage from './features/public_pages/CollegesPage';
import ContactPage from './features/public_pages/ContactPage';
import CSRPage from './features/public_pages/CSRPage';
import NoticesListPage from './features/public_pages/NoticesListPage';
import PrivacyPage from './features/public_pages/PrivacyPage';
import SchoolsPage from './features/public_pages/SchoolsPage';


const App: React.FC = () => {
  // State is now based on the URL hash
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  // The navigate function now manipulates the hash
  const navigate = useCallback((to: string) => {
    // Ensure the path starts with /
    const targetPath = to.startsWith('/') ? to : `/${to}`;
    window.location.hash = targetPath;
    window.scrollTo(0, 0); // Scroll to top on navigation
  }, []);

  // Listen for hash changes (e.g., browser back/forward buttons)
  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // The path for routing is derived from the hash, removing the '#'
  const path = useMemo(() => currentHash.substring(1) || '/', [currentHash]);

  // Main Router
  if (path.startsWith('/portal')) {
    return <CollegeOSApp navigate={navigate} />;
  }

  switch(path) {
    case '/':
      return <LandingPage navigate={navigate} />;
    case '/about':
      return <AboutPage navigate={navigate} />;
    case '/admissions':
       return <AdmissionsPage navigate={navigate} />;
    case '/colleges':
      return <CollegesPage navigate={navigate} />;
    case '/schools':
        return <SchoolsPage navigate={navigate} />;
    case '/notices':
        return <NoticesListPage navigate={navigate} />;
    case '/contact':
        return <ContactPage navigate={navigate} />;
    case '/csr':
        return <CSRPage navigate={navigate} />;
    case '/privacy':
        return <PrivacyPage navigate={navigate} />;
    default:
        // For any other path, redirect to home. In a real app, this would be a 404 page.
        return <LandingPage navigate={navigate} />;
  }
};

export default App;