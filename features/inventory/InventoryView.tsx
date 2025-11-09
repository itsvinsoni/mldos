import React, { useMemo, useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Resource, Action, InventoryItem, IssueRecord, StudentProfile, User } from '../../types';
import { EditIcon, UploadIcon } from '../../components/Icons';
import MobileCard from '../../components/MobileCard';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';

const InventoryView: React.FC = () => {
    const { can } = usePermissions();
    const canCreate = can(Resource.INVENTORY, Action.CREATE);
    const canUpdate = can(Resource.INVENTORY, Action.UPDATE);
    
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [items, records, users, profiles] = await Promise.all([
                api.getInventoryItems(),
                api.getIssueRecords(),
                api.getUsers(),
                api.getStudentProfiles(),
            ]);
            setInventoryItems(items);
            setIssueRecords(records);
            setUsers(users);
            setStudentProfiles(profiles);
            setLoading(false);
        };
        fetchData();
    }, []);

    const studentUserMap = useMemo(() => {
        // FIX: Explicitly type Maps to prevent incorrect type inference from untyped API data.
        const profileMap = new Map<number, string>(studentProfiles.map(p => [p.id, p.userId]));
        const userMap = new Map<string, string>(users.map(u => [u.id, u.name]));
        const finalMap = new Map<number, string>();
        profileMap.forEach((userId, profileId) => {
            finalMap.set(profileId, userMap.get(userId) || 'Unknown');
        });
        return finalMap;
    }, [studentProfiles, users]);

    const itemMap = new Map(inventoryItems.map(i => [i.id, i.name]));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'Issued': return 'bg-yellow-100 text-yellow-800';
            case 'Maintenance': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'New': return 'text-blue-600';
            case 'Good': return 'text-green-600';
            case 'Fair': return 'text-yellow-600';
            case 'Damaged': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const calculateFine = (dueDateStr: string, returnDateStr: string | null): number => {
        if (returnDateStr) return 0; // No fine if returned
        const dueDate = new Date(dueDateStr);
        const today = new Date();
        if (today <= dueDate) return 0;

        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * 1; // $1 per day fine
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-text">Inventory & Issue</h1>
                <div className="hidden md:block">
                    {canCreate && <button className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Add New Item</button>}
                </div>
            </div>

            {/* Inventory Items Table */}
            <div className="mb-8">
                 <h2 className="text-xl font-semibold text-brand-text mb-4">Inventory Stock</h2>
                 
                 {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {inventoryItems.map(item => (
                        <MobileCard key={item.id}>
                             <div className="flex justify-between items-start">
                               <div>
                                    <p className="font-bold text-brand-text">{item.name}</p>
                                    <p className="text-sm text-brand-text-light">{item.sku}</p>
                               </div>
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="mt-4 text-sm text-brand-text-light space-y-1">
                                <p><span className="font-semibold text-gray-600">Category:</span> {item.category}</p>
                                <p><span className="font-semibold text-gray-600">Condition:</span> <span className={`${getConditionColor(item.condition)} font-medium`}>{item.condition}</span></p>
                            </div>
                        </MobileCard>
                    ))}
                </div>

                 {/* Desktop View */}
                 <div className="hidden lg:block bg-white rounded-2xl shadow-subtle overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    {canUpdate && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventoryItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getConditionColor(item.condition)}`}>{item.condition}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        {canUpdate && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button className="text-gray-400 hover:text-brand-orange disabled:text-gray-300 disabled:cursor-not-allowed" disabled={item.status === 'Issued'}>Issue</button>
                                                    <button className="text-gray-400 hover:text-brand-orange"><EditIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Issue Records Table */}
            <div>
                 <h2 className="text-xl font-semibold text-brand-text mb-4">Issue Records</h2>
                 {/* Mobile view would go here, similar to the above */}

                 {/* Desktop View */}
                 <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued To</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {issueRecords.map((record) => {
                                    const fine = calculateFine(record.due_date, record.return_date);
                                    return (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{itemMap.get(record.inventoryItemId) || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{studentUserMap.get(record.studentId) || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.due_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {record.return_date ? <span className="font-semibold text-green-600">Returned on {record.return_date}</span> : <span className="font-semibold text-red-600">Pending</span>}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${fine > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                ${fine.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                     <button className="text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed" disabled={!record.signed_doc_url}><UploadIcon className="w-5 h-5" /></button>
                                                    {canUpdate && !record.return_date && <button className="text-gray-400 hover:text-green-600">Return</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryView;
