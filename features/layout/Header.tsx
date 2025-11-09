
import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SearchIcon, NotificationIcon, MenuIcon } from '../../components/Icons';
import { ALL_NAV_ITEMS } from '../../constants';
import { SettingsContext } from '../../contexts/SettingsContext';

interface HeaderProps {
    toggleSidebar: () => void;
    currentView: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentView }) => {
    const { user } = useContext(AuthContext);
    const { settings } = useContext(SettingsContext);

    const viewTitle = useMemo(() => {
        const item = ALL_NAV_ITEMS.find(i => i.view === currentView);
        if (!item || !user) return 'Dashboard';
        const userPrimaryRole = user.roleIds[0];
        return item.roleNames?.[userPrimaryRole] || item.name;
    }, [currentView, user]);

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none hidden lg:block">
                    <MenuIcon className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-brand-text ml-2 lg:hidden">{settings.appName}</h1>
                <div className="relative ml-4 hidden md:block">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                       <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        type="text"
                        placeholder="Search... (eg: stu:John, prog:B.Tech, fee:R-001)"
                    />
                </div>
            </div>

            <div className="flex items-center">
                <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                     <NotificationIcon className="h-6 w-6" />
                     <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center ml-4">
                    <img className="h-10 w-10 rounded-full object-cover" src={user?.avatarUrl} alt="User avatar" />
                    <div className="ml-3 hidden md:block">
                        <p className="text-sm font-semibold text-brand-text">{user?.name}</p>
                        <p className="text-xs text-brand-text-light capitalize">{user?.roles.map(r => r.name).join(', ')}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
