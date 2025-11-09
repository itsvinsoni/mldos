import React, { useState, useMemo, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from '../dashboard/DashboardView';
import StudentsView from '../students/StudentsView';
import FeesView from '../fees/FeesView';
import InventoryView from '../inventory/InventoryView';
import CoursesView from '../courses/CoursesView';
import TimetableView from '../timetable/TimetableView';
import ReportsView from '../reports/ReportsView';
import SettingsView from '../settings/SettingsView';
import ApprovalsView from '../approvals/ApprovalsView';
import IDCardTemplateView from '../templates/IDCardTemplateView';
import DataImportView from '../import/DataImportView';
import BottomNavBar from './BottomNavBar';
import FloatingActionButton from '../../components/FloatingActionButton';
import { SettingsContext } from '../../contexts/SettingsContext';
import ToastContainer from '../../components/ToastContainer';


const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-6">
        <h1 className="text-3xl font-bold text-brand-text">{title}</h1>
        <p className="mt-2 text-brand-text-light">This feature is under construction.</p>
    </div>
);

interface DashboardLayoutProps {
    navigate: (to: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ navigate }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { settings } = useContext(SettingsContext);
    
    const hash = window.location.hash || '#/portal/dashboard';
    const currentView = hash.split('/')[2] || 'dashboard';

    const fabAction = useMemo(() => {
        switch(currentView) {
            case 'students':
                return { action: () => console.log('Add Student'), 'aria-label': 'Add Student' };
            case 'fees':
                 return { action: () => console.log('Add Fee'), 'aria-label': 'Add Fee Receipt' };
            case 'inventory':
                 return { action: () => console.log('Add Item'), 'aria-label': 'Add Inventory Item' };
            default:
                return null;
        }
    }, [currentView]);

    const renderView = () => {
        switch(currentView) {
            case 'dashboard': return <DashboardView navigate={navigate} />;
            case 'students': return <StudentsView />;
            case 'fees': return <FeesView />;
            case 'inventory': return <InventoryView />;
            case 'courses': return <CoursesView />;
            case 'timetable': return <TimetableView />;
            case 'reports': return <ReportsView />;
            case 'settings': return <SettingsView />;
            case 'approvals': return <ApprovalsView />;
            case 'templates': return <IDCardTemplateView />;
            case 'import': return <DataImportView />;
            case 'colleges': return <PlaceholderView title="Colleges" />;
            case 'faculty': return <PlaceholderView title="Faculty Management" />;
            case 'details': return <PlaceholderView title="My Details" />;
            case 'notices': return <PlaceholderView title="Notices" />;
            default:
                return <DashboardView navigate={navigate} />;
        }
    }

    const themeStyle = {
        '--brand-orange': settings.themeColor,
        '--brand-orange-dark': settings.themeColor, // simplified for demo
        '--brand-orange-light': `${settings.themeColor}33`, // semi-transparent
    } as React.CSSProperties;

    return (
        <div style={themeStyle} className="flex h-screen bg-brand-bg">
            <Sidebar isOpen={isSidebarOpen} navigate={navigate} currentView={currentView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} currentView={currentView}/>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg pb-20 lg:pb-0">
                    <div className="container mx-auto px-4 sm:px-6 py-8">
                        {renderView()}
                    </div>
                </main>
                <ToastContainer />
                <BottomNavBar navigate={navigate} currentView={currentView} />
                {fabAction && <FloatingActionButton onClick={fabAction.action} aria-label={fabAction['aria-label']} />}
            </div>
        </div>
    );
};

export default DashboardLayout;