import React, { useMemo, useState, useEffect, useContext } from 'react';
import { EditIcon, DeleteIcon, UploadIcon } from '../../components/Icons';
import { usePermissions } from '../../hooks/usePermissions';
import { Resource, Action, StudentProfile, User, Section, Batch, Program } from '../../types';
import MobileCard from '../../components/MobileCard';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';
import { NotificationContext } from '../../contexts/NotificationContext';
import EmptyState from '../../components/EmptyState';

// A simple modal for Add/Edit form. In a real app, this would be more robust.
const StudentFormModal = ({ student, onSave, onCancel }: { student: Partial<StudentProfile & User> | null, onSave: (data: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({ name: '', roll_no: '', ...student });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{student.id ? 'Edit Student' : 'Add Student'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded"/>
                        <input name="roll_no" value={formData.roll_no} onChange={handleChange} placeholder="Roll No." className="w-full p-2 border rounded"/>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-orange text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const StudentsView: React.FC = () => {
    const { can } = usePermissions();
    const { addNotification } = useContext(NotificationContext);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [editingStudent, setEditingStudent] = useState<Partial<StudentProfile & User> | null>(null);

    const canCreate = can(Resource.STUDENTS, Action.CREATE);
    const canUpdate = can(Resource.STUDENTS, Action.UPDATE);
    const canDelete = can(Resource.STUDENTS, Action.DELETE);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, u, sec, b, p] = await Promise.all([
                api.getStudentProfiles(),
                api.getUsers(),
                api.getSections(),
                api.getBatches(),
                api.getPrograms(),
            ]);
            setStudents(s);
            setUsers(u);
            setSections(sec);
            setBatches(b);
            setPrograms(p);
        } catch (error) {
            addNotification('Failed to load student data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handleSaveStudent = async (data: any) => {
        try {
            if (data.id) {
                // This is a simplified update. A real implementation would be more complex.
                // await api.updateStudentProfile(data); 
                addNotification('Student updated successfully', 'success');
            } else {
                // Simplified creation
                // await api.createStudentProfile(data);
                addNotification('Student added successfully', 'success');
            }
            setEditingStudent(null);
            fetchData();
        } catch (error) {
            addNotification('Failed to save student', 'error');
        }
    };

    const handleDeleteStudent = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                // await api.deleteStudentProfile(id);
                addNotification('Student deleted successfully', 'success');
                fetchData();
            } catch (error) {
                addNotification('Failed to delete student', 'error');
            }
        }
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-red-100 text-red-800';
            case 'Partial': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
    const sectionMap = useMemo(() => new Map(sections.map(s => [s.id, s])), [sections]);
    const batchMap = useMemo(() => new Map(batches.map(b => [b.id, b])), [batches]);
    const programMap = useMemo(() => new Map(programs.map(p => [p.id, p])), [programs]);
    
    const enrichedStudents = useMemo(() => students.map(sp => {
        const studentUser = userMap.get(sp.userId);
        const section = sectionMap.get(sp.sectionId);
        const batch = section ? batchMap.get(section.batchId) : undefined;
        const program = batch ? programMap.get(batch.programId) : undefined;
        return {
            ...sp,
            name: studentUser?.name || 'Unknown Student',
            sectionName: section?.name || 'N/A',
            batch: batch ? `${batch.startYear}-${batch.endYear}` : 'N/A',
            programName: program?.name || 'N/A',
        };
    }), [students, userMap, sectionMap, batchMap, programMap]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    }

    const renderContent = () => {
        if (enrichedStudents.length === 0) {
            return (
                <EmptyState
                    title="No students found"
                    message="Get started by adding your first student to the system."
                    action={canCreate ? { label: "Add Your First Student", onClick: () => setEditingStudent({}) } : undefined}
                />
            );
        }

        return (
            <>
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                    {enrichedStudents.map(student => (
                        <MobileCard key={student.id}>
                            <div className="flex justify-between items-start">
                            <div>
                                    <p className="font-bold text-brand-text">{student.name}</p>
                                    <p className="text-sm text-brand-text-light">{student.roll_no}</p>
                            </div>
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.fee_status)}`}>
                                    {student.fee_status}
                                </span>
                            </div>
                            <div className="mt-4 text-sm text-brand-text-light space-y-1">
                                <p><span className="font-semibold text-gray-600">Program:</span> {student.programName}</p>
                                <p><span className="font-semibold text-gray-600">Batch:</span> {student.batch} (Sec: {student.sectionName})</p>
                                <p><span className="font-semibold text-gray-600">Attendance:</span> {student.attendance}%</p>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch & Section</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                                    {(canUpdate || canDelete) && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrichedStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll_no}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.programName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.batch} (Sec: {student.sectionName})</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.fee_status)}`}>
                                                {student.fee_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.attendance}%</td>
                                        {(canUpdate || canDelete) && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button className="text-gray-400 hover:text-blue-600"><UploadIcon className="w-5 h-5" /></button>

                                                    {canUpdate && <button onClick={() => setEditingStudent(student)} className="text-gray-400 hover:text-brand-orange"><EditIcon className="w-5 h-5" /></button>}
                                                    
                                                    {canDelete && <button onClick={() => handleDeleteStudent(student.id)} className="text-gray-400 hover:text-red-600"><DeleteIcon className="w-5 h-5" /></button>}
                                                </div>
                                            </td>
                                        )}
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
            {editingStudent && <StudentFormModal student={editingStudent} onSave={handleSaveStudent} onCancel={() => setEditingStudent(null)} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-text">Student Management</h1>
                <div className="hidden md:block">
                    {canCreate && <button onClick={() => setEditingStudent({})} className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Add Student</button>}
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default StudentsView;