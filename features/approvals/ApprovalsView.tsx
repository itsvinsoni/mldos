import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ApprovalRequest, User, Resource, Action } from '../../types';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';
import { usePermissions } from '../../hooks/usePermissions';
import { NotificationContext } from '../../contexts/NotificationContext';
import MobileCard from '../../components/MobileCard';

const ApprovalsView: React.FC = () => {
    const { can } = usePermissions();
    const { addNotification } = useContext(NotificationContext);
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const canUpdate = can(Resource.APPROVALS, Action.UPDATE);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqs, usrs] = await Promise.all([
                api.getApprovalRequests(),
                api.getUsers(),
            ]);
            setRequests(reqs);
            setUsers(usrs);
        } catch (error) {
            addNotification('Failed to load approval requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: number, status: 'Approved' | 'Rejected') => {
        try {
            await api.updateApprovalRequestStatus(id, status);
            addNotification(`Request ${status.toLowerCase()} successfully`, 'success');
            fetchData(); // Refresh data
        } catch (error) {
            addNotification('Failed to update request status', 'error');
        }
    };

    const userMap = useMemo(() => new Map(users.map(u => [u.id, u.name])), [users]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text mb-6">Approval Management</h1>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {requests.map(req => (
                    <MobileCard key={req.id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-brand-text">{req.type}</p>
                                <p className="text-sm text-brand-text-light">From: {userMap.get(req.requesterId) || 'Unknown'}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                {req.status}
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">{req.details}</p>
                        {req.status === 'Pending' && canUpdate && (
                            <div className="mt-4 flex justify-end space-x-2">
                                <button onClick={() => handleStatusChange(req.id, 'Rejected')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md">Reject</button>
                                <button onClick={() => handleStatusChange(req.id, 'Approved')} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md">Approve</button>
                            </div>
                        )}
                    </MobileCard>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {canUpdate && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userMap.get(request.requesterId) || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">{request.details}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date_submitted}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    {canUpdate && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {request.status === 'Pending' && (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => handleStatusChange(request.id, 'Rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                                    <button onClick={() => handleStatusChange(request.id, 'Approved')} className="text-green-600 hover:text-green-900">Approve</button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApprovalsView;
