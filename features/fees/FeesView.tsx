import React, { useState, useEffect } from 'react';
import { ReceiptIcon, EditIcon } from '../../components/Icons';
import { usePermissions } from '../../hooks/usePermissions';
import { Resource, Action, FeeReceipt } from '../../types';
import MobileCard from '../../components/MobileCard';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const FeesView: React.FC = () => {
    const { can } = usePermissions();
    const canCreate = can(Resource.FEES, Action.CREATE);
    const canUpdate = can(Resource.FEES, Action.UPDATE);
    
    const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const receipts = await api.getFeeReceipts();
            setFeeReceipts(receipts);
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalDue = feeReceipts.reduce((sum, fee) => sum + fee.remaining_due, 0);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    const renderContent = () => {
        if (feeReceipts.length === 0) {
            return (
                <EmptyState
                    title="No fee receipts found"
                    message="Get started by adding your first fee receipt entry."
                    action={canCreate ? { label: "Add First Fee Entry", onClick: () => {} } : undefined}
                />
            );
        }

        return (
            <>
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {feeReceipts.map(fee => (
                        <MobileCard key={fee.id}>
                            <div className="flex justify-between items-start">
                            <div>
                                    <p className="font-bold text-brand-text">{fee.studentName}</p>
                                    <p className="text-sm text-brand-text-light">{fee.receipt_no}</p>
                            </div>
                                <p className={`text-sm font-bold ${fee.remaining_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${fee.remaining_due > 0 ? `${fee.remaining_due.toLocaleString()} Due` : 'Paid'}
                                </p>
                            </div>
                            <div className="mt-4 text-sm text-brand-text-light space-y-1">
                                <p><span className="font-semibold text-gray-600">Amount Paid:</span> <span className="text-green-700 font-semibold">${fee.amount_paid.toLocaleString()}</span></p>
                                <p><span className="font-semibold text-gray-600">Date:</span> {fee.date}</p>
                                <p><span className="font-semibold text-gray-600">Type:</span> {fee.payment_type}</p>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No.</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Due</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {feeReceipts.map((fee) => (
                                    <tr key={fee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{fee.receipt_no}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{fee.studentName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${fee.amount_paid.toLocaleString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${fee.remaining_due > 0 ? 'text-red-600' : 'text-gray-500'}`}>${fee.remaining_due.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.payment_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button className="text-gray-400 hover:text-blue-600"><ReceiptIcon className="w-5 h-5" /></button>
                                                {canUpdate && <button className="text-gray-400 hover:text-brand-orange"><EditIcon className="w-5 h-5" /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-text">Fee Management</h1>
                    { feeReceipts.length > 0 && <p className="text-brand-text-light mt-1 text-sm md:text-base">Total Outstanding Dues: <span className="font-bold text-red-600">${totalDue.toLocaleString()}</span></p>}
                </div>
                 <div className="hidden md:block">
                    {canCreate && <button className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Add Fee Entry</button>}
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default FeesView;