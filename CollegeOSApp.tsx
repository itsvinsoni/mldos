import React, { useState, useMemo } from 'react';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './features/layout/DashboardLayout';
import { AuthContext } from './contexts/AuthContext';
import { User, Role } from './types';
import { SettingsProvider } from './contexts/SettingsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { init, getUsers, getRoles } from './services/localApi';

// Initialize the local database on app start
init();

interface CollegeOSAppProps {
    navigate: (to: string) => void;
}

const CollegeOSApp: React.FC<CollegeOSAppProps> = ({ navigate }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const authContextValue = useMemo(() => ({
    user: currentUser,
    login: async (email: string, pass: string): Promise<boolean> => {
      const users = await getUsers();
      const roles = await getRoles();
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
        const userRoles = user.roleIds
            .map(roleId => roles.find(r => r.id === roleId))
            .filter((r): r is Role => !!r);

        setCurrentUser({ ...user, roles: userRoles });
        // After successful login, navigate to the dashboard
        navigate('/portal/dashboard');
        return true;
      }
      return false;
    },
    logout: () => {
      setCurrentUser(null);
      // After logout, navigate to the public home page
      navigate('/');
    },
  }), [currentUser, navigate]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <SettingsProvider>
        <NotificationProvider>
          <div className="bg-brand-bg min-h-screen font-sans text-brand-text">
            {currentUser ? <DashboardLayout navigate={navigate} /> : <LoginPage />}
          </div>
        </NotificationProvider>
      </SettingsProvider>
    </AuthContext.Provider>
  );
};

export default CollegeOSApp;