import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { ALL_NAV_ITEMS, BOTTOM_NAV_VIEWS } from '../../constants';
import { Action } from '../../types';
import { MoreVerticalIcon } from '../../components/Icons';

interface BottomNavBarProps {
  navigate: (to: string) => void;
  currentView: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ navigate, currentView }) => {
  const { user } = useContext(AuthContext);
  const { can } = usePermissions();

  const navItems = useMemo(() => {
    return ALL_NAV_ITEMS
        .filter(item => can(item.resource, Action.READ))
        .filter(item => BOTTOM_NAV_VIEWS.includes(item.view));
  }, [can]);

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 lg:hidden flex justify-around items-center z-50">
      {navItems.slice(0, 4).map((item) => {
        const userPrimaryRole = user.roleIds[0];
        const itemName = item.roleNames?.[userPrimaryRole] || item.name;

        return (
          <button
            key={item.view}
            onClick={() => navigate(`/portal/${item.view}`)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.view ? 'text-brand-orange-dark' : 'text-brand-text-light hover:text-brand-text'
            }`}
          >
            <div className="w-6 h-6">{item.icon}</div>
            <span className="text-xs mt-1">{itemName}</span>
          </button>
        );
      })}
       <button className="flex flex-col items-center justify-center w-full h-full text-brand-text-light hover:text-brand-text">
        <MoreVerticalIcon />
        <span className="text-xs mt-1">More</span>
       </button>
    </div>
  );
};

export default BottomNavBar;