
import React from 'react';
import { ReportIcon, FeeIcon, StudentIcon, LibraryIcon } from '../../components/Icons';

interface Report {
    name: string;
    description: string;
    category: 'Financial' | 'Academic' | 'Administrative';
    icon: React.ReactElement;
}

const availableReports: Report[] = [
    { name: 'Collections by Program', description: 'Total fees collected, broken down by academic program for the selected date range.', category: 'Financial', icon: <FeeIcon /> },
    { name: 'Outstanding Dues Analysis', description: 'Aging report of all pending student fees, with options to filter by batch and program.', category: 'Financial', icon: <FeeIcon /> },
    { name: 'Student Attendance Summary', description: 'Aggregate attendance percentages for all students, filterable by course, section, or faculty.', category: 'Academic', icon: <StudentIcon /> },
    { name: 'Enrollment Statistics', description: 'View student enrollment trends over time, with demographic and regional breakdowns.', category: 'Academic', icon: <StudentIcon /> },
    { name: 'Inventory Issue History', description: 'Complete log of all items issued from inventory, including return status and fines collected.', category: 'Administrative', icon: <LibraryIcon /> },
    { name: 'Overdue Items Report', description: 'A list of all currently overdue library books and equipment, with student contact details.', category: 'Administrative', icon: <LibraryIcon /> },
];

const ReportsView: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-text">Reports Studio</h1>
                <p className="text-brand-text-light">Generate, schedule, and export custom reports.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-subtle p-6 mb-8">
                <h2 className="text-xl font-semibold text-brand-text mb-2">No-Code Report Builder (Coming Soon)</h2>
                <p className="text-brand-text-light">Our upcoming report builder will allow you to drag-and-drop fields, create pivot tables, and design custom reports without writing any code. You'll be able to save your reports, share them with colleagues, and schedule automated delivery to your inbox.</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-text mb-4">Pre-built Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableReports.map((report) => (
                        <div key={report.name} className="bg-white p-6 rounded-2xl shadow-subtle flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="bg-brand-orange-light p-3 rounded-xl">
                                        <div className="h-6 w-6 text-brand-orange-dark">
                                            {report.icon}
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{report.category}</span>
                                </div>
                                <h4 className="font-bold text-brand-text mb-1">{report.name}</h4>
                                <p className="text-sm text-brand-text-light">{report.description}</p>
                            </div>
                            <div className="mt-4">
                                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm">Generate Report</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
