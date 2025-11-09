
import React, { useMemo, useState, useEffect } from 'react';
import * as api from '../../services/localApi';
import { TimetableSlot, Section, Batch, Program, Course, User } from '../../types';
import Spinner from '../../components/Spinner';

const TimetableView: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tt, secs, bchs, progs, crss, usrs] = await Promise.all([
                    api.getTimetable(),
                    api.getSections(),
                    api.getBatches(),
                    api.getPrograms(),
                    api.getCourses(),
                    api.getUsers(),
                ]);
                setTimetable(tt);
                setSections(secs);
                setBatches(bchs);
                setPrograms(progs);
                setCourses(crss);
                setUsers(usrs);

                if (bchs.length > 0) {
                    const firstBatchId = bchs[0].id;
                    setSelectedBatchId(firstBatchId);
                    const firstSectionOfBatch = secs.find(s => s.batchId === firstBatchId);
                    setSelectedSectionId(firstSectionOfBatch?.id || null);
                }
            } catch (error) {
                console.error("Failed to fetch timetable data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const timeSlots = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4', '4-5'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const courseMap = useMemo(() => new Map(courses.map(c => [c.id, c])), [courses]);
    const facultyMap = useMemo(() => new Map(users.map(u => [u.id, u.name])), [users]);

    const relevantSections = useMemo(() => {
        if (!selectedBatchId) return sections;
        return sections.filter(s => s.batchId === selectedBatchId);
    }, [selectedBatchId, sections]);

    const timetableData = useMemo(() => {
        if (!selectedSectionId) return [];
        return timetable.filter(slot => slot.sectionId === selectedSectionId);
    }, [selectedSectionId, timetable]);
    
    const programMap = useMemo(() => new Map(programs.map(p => [p.id, p])), [programs]);
    const batchWithProgram = useMemo(() => batches.map(b => ({...b, program: programMap.get(b.programId)})), [batches, programMap]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-text">Class Timetables</h1>
                <button className="px-4 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-brand-orange-dark transition-colors">Edit Schedule</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-2xl shadow-subtle">
                <div>
                    <label htmlFor="batch-filter" className="block text-sm font-medium text-gray-700">Batch</label>
                    <select
                        id="batch-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md"
                        value={selectedBatchId || ''}
                        onChange={(e) => {
                            const newBatchId = Number(e.target.value);
                            setSelectedBatchId(newBatchId);
                            const firstSection = sections.find(s => s.batchId === newBatchId);
                            setSelectedSectionId(firstSection?.id || null);
                        }}
                    >
                        {batchWithProgram.map(b => <option key={b.id} value={b.id}>{b.program?.name} ({b.startYear}-{b.endYear})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700">Section</label>
                    <select
                        id="section-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-orange focus:border-brand-orange sm:text-sm rounded-md"
                        value={selectedSectionId || ''}
                        onChange={(e) => setSelectedSectionId(Number(e.target.value))}
                        disabled={!selectedBatchId}
                    >
                        {relevantSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Time</th>
                                {days.map(day => (
                                    <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {timeSlots.map(slot => (
                                <tr key={slot} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">{slot}</td>
                                    {days.map(day => {
                                        if (slot === '1-2') { // Lunch break
                                            return <td key={day} className="bg-gray-100 text-center text-sm font-semibold text-gray-500">LUNCH</td>
                                        }
                                        const slotData = timetableData.find(d => d.day === day && d.time_slot === slot);
                                        return (
                                            <td key={day} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 align-top">
                                                {slotData ? (
                                                    <div className="bg-brand-orange-light text-brand-orange-dark p-2 rounded-lg text-center">
                                                        <p className="font-bold text-sm">{courseMap.get(slotData.courseId)?.name}</p>
                                                        <p className="text-xs">{facultyMap.get(slotData.facultyId)}</p>
                                                    </div>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimetableView;