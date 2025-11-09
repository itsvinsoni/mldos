import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ALL_NAV_ITEMS } from '../../constants';
import { CollegeIcon, LogoutIcon } from '../../components/Icons';
import { usePermissions } from '../../hooks/usePermissions';
import { Action } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  navigate: (to: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navigate, currentView }) => {
  const { user, logout } = useContext(AuthContext);
  const { can } = usePermissions();

  const visibleNavItems = useMemo(() => {
    return ALL_NAV_ITEMS.filter(item => can(item.resource, Action.READ));
  }, [can]);

  if (!user) return null;

  return (
    <div className={`hidden lg:flex flex-col bg-white text-brand-text-light transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`} style={{boxShadow: 'inset -1px 0 0 0 #e2e8f0'}}>
      <div className={`flex items-center p-4 border-b border-gray-200 ${isOpen ? 'justify-start' : 'justify-center'}`}>
        <div className="bg-brand-orange-light p-2 rounded-lg">
          <CollegeIcon className="h-6 w-6 text-brand-orange-dark" />
        </div>
        {isOpen && <span className="ml-3 text-xl font-bold text-brand-text font-poppins">OS</span>}
      </div>

      <nav className="flex-1 mt-6 px-2 space-y-2">
        {visibleNavItems.map((item) => {
          // Check for role-specific naming, default to item.name
          const userPrimaryRole = user.roleIds[0]; // Simple assumption for now
          const itemName = item.roleNames?.[userPrimaryRole] || item.name;

          return (
            <a
              key={item.name}
              href={`/#/portal/${item.view}`}
              onClick={(e) => { e.preventDefault(); navigate(`/portal/${item.view}`); }}
              className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                currentView === item.view
                  ? 'bg-brand-orange-light text-brand-orange-dark'
                  : 'hover:bg-gray-100 hover:text-brand-text'
              }`}
            >
              <div className="flex-shrink-0 h-6 w-6">{item.icon}</div>
              {isOpen && <span className="ml-4 font-medium">{itemName}</span>}
            </a>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-200">
        <a
          href="/#/"
          onClick={(e) => {e.preventDefault(); logout();}}
          className={`flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 hover:text-brand-text`}
        >
          <LogoutIcon className="h-6 w-6" />
          {isOpen && <span className="ml-4 font-medium">Logout</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;