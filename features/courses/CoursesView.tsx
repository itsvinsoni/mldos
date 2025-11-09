
import React, { useState, useMemo, useEffect } from 'react';
import { College, Department, Program, Course } from '../../types';
import * as api from '../../services/localApi';
import { CollegeIcon, CourseIcon, DeleteIcon, EditIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const CoursesView: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [colleges, setColleges] = useState<College[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cols, depts, progs, crss] = await Promise.all([
                    api.getColleges(),
                    api.getDepartments(),
                    api.getPrograms(),
                    api.getCourses(),
                ]);
                setColleges(cols);
                setDepartments(depts);
                setPrograms(progs);
                setCourses(crss);
                if (cols.length > 0) {
                    setSelectedCollege(cols[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch academic data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredDepartments = useMemo(() => {
        if (!selectedCollege) return [];
        return departments.filter(d => d.collegeId === selectedCollege);
    }, [selectedCollege, departments]);

    const filteredPrograms = useMemo(() => {
        let progs = programs;
        if (selectedDepartment) {
            progs = progs.filter(p => p.departmentId === selectedDepartment);
        } else if (selectedCollege) {
            const deptIds = filteredDepartments.map(d => d.id);
            progs = progs.filter(p => deptIds.includes(p.departmentId));
        }
        return progs;
    }, [selectedCollege, selectedDepartment, filteredDepartments, programs]);

    const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCollege(Number(e.target.value));
        setSelectedDepartment(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-text">Academics Management</h1>
                <button className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Add Program</button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-2xl shadow-subtle">
                <div>
                    <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700">College</label>
                    <select
                        id="college-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md"
                        value={selectedCollege || ''}
                        onChange={handleCollegeChange}
                    >
                        {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                        id="department-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md"
                        value={selectedDepartment || ''}
                        onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                        disabled={!selectedCollege}
                    >
                        <option value="">All Departments</option>
                        {filteredDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Program and Course List */}
            <div className="space-y-6">
                {filteredPrograms.map(program => (
                    <div key={program.id} className="bg-white rounded-2xl shadow-subtle overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <div>
                               <h2 className="text-xl font-bold text-brand-text">{program.name}</h2>
                               <p className="text-sm text-brand-text-light">{program.duration}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="text-gray-400 hover:text-brand-orange"><EditIcon className="w-5 h-5" /></button>
                                <button className="text-gray-400 hover:text-red-600"><DeleteIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {courses.filter(c => c.programId === program.id).map(course => (
                                <li key={course.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center">
                                       <div className="bg-brand-orange-light p-2 rounded-lg mr-4">
                                         <CourseIcon className="h-5 w-5 text-brand-orange-dark" />
                                       </div>
                                       <div>
                                           <p className="text-sm font-medium text-gray-900">{course.name}</p>
                                           <p className="text-sm text-gray-500">{course.code} &bull; {course.credits} Credits</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-gray-400 hover:text-brand-orange text-xs">Edit</button>
                                        <button className="text-gray-400 hover:text-red-600 text-xs">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesView;