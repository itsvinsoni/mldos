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
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  const navigate = useCallback((to: string) => {
    const targetPath = to.startsWith('/') ? to : `/${to}`;
    if (window.location.hash !== `#${targetPath}`) {
      window.location.hash = targetPath;
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // This effect runs once on initial load to handle deep links on static hosts like Netlify
    const path = window.location.pathname;
    const hash = window.location.hash;
    // If there's a path but no hash, it means the user accessed a deep link directly.
    // The _redirects rule served index.html, and now we must sync the path to the hash.
    if (path !== '/' && path !== '/index.html' && !hash) {
      // Use replace to avoid a broken "back" button history
      window.location.replace(`/#${path}`);
    }
  }, []);


  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const path = useMemo(() => currentHash.substring(1) || '/', [currentHash]);

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
        // For any other path, redirect to home.
        return <LandingPage navigate={navigate} />;
  }
};

export default App;