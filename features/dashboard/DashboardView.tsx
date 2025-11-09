import React, { useContext, useMemo, useState, useEffect } from 'react';
import { TimetableSlot, User, Resource, Action, Notice, Course, StudentProfile, FeeReceipt, Program, IssueRecord, ApprovalRequest } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { StudentIcon, FeeIcon, CourseIcon, LibraryIcon, ReportIcon, ClockIcon, MyDetailsIcon } from '../../components/Icons';
import Card from '../../components/Card';
import { usePermissions } from '../../hooks/usePermissions';
import * as api from '../../services/localApi';
import Spinner from '../../components/Spinner';

const NoticeBoard: React.FC<{notices: Notice[]}> = ({ notices }) => {
    const { user } = useContext(AuthContext);
    const visibleNotices = notices.filter(n => user && user.roleIds.some(roleId => n.visible_to_roles.includes(roleId)));

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle">
            <div className="flex items-center mb-4">
                <ReportIcon className="w-6 h-6 text-brand-orange-dark" />
                <h3 className="text-lg font-semibold text-brand-text ml-2">Notice Board</h3>
            </div>
            <ul className="space-y-4">
                {visibleNotices.slice(0, 3).map(notice => (
                    <li key={notice.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="font-semibold text-brand-text">{notice.title}</p>
                             <p className="text-sm text-brand-text-light mt-1">{notice.description}</p>
                           </div>
                           <span className="text-xs text-gray-400 flex-shrink-0 ml-4 pt-1">{notice.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TodaysSchedule: React.FC<{ user: User | null, timetable: TimetableSlot[], courses: Course[], users: User[], studentProfiles: StudentProfile[] }> = (props) => {
    const { user, timetable, courses, users, studentProfiles } = props;
    const courseMap = useMemo(() => new Map(courses.map(c => [c.id, c.name])), [courses]);
    const facultyMap = useMemo(() => new Map(users.map(u => [u.id, u.name])), [users]);
    const isStudent = user?.roleIds.includes('student') ?? false;
    const isFaculty = user?.roleIds.includes('faculty') ?? false;

    const relevantSlots = useMemo(() => {
        if (!user) return [];
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        if (isStudent) {
            const studentProfile = studentProfiles.find(sp => sp.userId === user.id);
            if (!studentProfile) return [];
            return timetable.filter(slot => slot.sectionId === studentProfile.sectionId && slot.day === today);
        }
        if (isFaculty) {
            return timetable.filter(slot => slot.facultyId === user.id && slot.day === today);
        }
        return [];
    }, [user, isStudent, isFaculty, timetable, studentProfiles]);

    if (relevantSlots.length === 0) {
        return (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle">
                <div className="flex items-center mb-4">
                    <ClockIcon className="w-6 h-6 text-brand-orange-dark" />
                    <h3 className="text-lg font-semibold text-brand-text ml-2">Today's Schedule</h3>
                </div>
                <p className="text-brand-text-light">No classes scheduled for today.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle">
            <div className="flex items-center mb-4">
                <ClockIcon className="w-6 h-6 text-brand-orange-dark" />
                <h3 className="text-lg font-semibold text-brand-text ml-2">Today's Schedule</h3>
            </div>
            <ul className="space-y-3">
                {relevantSlots.sort((a,b) => a.time_slot.localeCompare(b.time_slot)).map(slot => (
                    <li key={slot.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-brand-text">{courseMap.get(slot.courseId)}</p>
                            <p className="text-sm text-brand-text-light">
                                {isStudent ? `by ${facultyMap.get(slot.facultyId)}` : 'Section Name'}
                            </p>
                        </div>
                        <span className="text-sm font-medium text-brand-orange-dark bg-brand-orange-light px-2 py-1 rounded-md">{slot.time_slot}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

interface DashboardData {
    studentProfiles: StudentProfile[];
    feeReceipts: FeeReceipt[];
    notices: Notice[];
    programs: Program[];
    issueRecords: IssueRecord[];
    timetable: TimetableSlot[];
    users: User[];
    courses: Course[];
    approvalRequests: ApprovalRequest[];
}

const DashboardView: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const { user } = useContext(AuthContext);
  const { can } = usePermissions();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const [studentProfiles, feeReceipts, notices, programs, issueRecords, timetable, users, courses, approvalRequests] = await Promise.all([
            api.getStudentProfiles(),
            api.getFeeReceipts(),
            api.getNotices(),
            api.getPrograms(),
            api.getIssueRecords(),
            api.getTimetable(),
            api.getUsers(),
            api.getCourses(),
            api.getApprovalRequests(),
        ]);
        setData({ studentProfiles, feeReceipts, notices, programs, issueRecords, timetable, users, courses, approvalRequests });
        setLoading(false);
    };
    fetchData();
  }, []);

  const totalStudents = data?.studentProfiles.length || 0;
  const totalFeesCollected = data?.feeReceipts.reduce((acc, fee) => acc + fee.amount_paid, 0) || 0;
  const totalPrograms = data?.programs.length || 0;
  const itemsIssued = data?.issueRecords.filter(r => r.return_date === null).length || 0;
  const pendingApprovals = data?.approvalRequests.filter(r => r.status === 'Pending').length || 0;
  
  const loggedInStudent = useMemo(() => user?.roleIds.includes('student') ? data?.studentProfiles.find(s => s.userId === user.id) : undefined, [user, data]);
  const studentFee = useMemo(() => loggedInStudent && data?.feeReceipts ? data.feeReceipts.find(f => f.studentId === loggedInStudent.id) : undefined, [loggedInStudent, data]);

  if (loading) {
      return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }
  
  if (!data) {
      return <p>Could not load dashboard data.</p>
  }

  const renderAdminCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {can(Resource.STUDENTS, Action.READ) && <Card title="Total Students" value={totalStudents.toString()} icon={<StudentIcon />} />}
      {can(Resource.FEES, Action.READ) && <Card title="Fees Collected (YTD)" value={`$${totalFeesCollected.toLocaleString()}`} icon={<FeeIcon />} />}
      {can(Resource.INVENTORY, Action.READ) && <Card title="Items Issued" value={itemsIssued.toString()} icon={<LibraryIcon />} />}
      {can(Resource.APPROVALS, Action.READ) && (
        <div onClick={() => navigate('/portal/approvals')} className="cursor-pointer">
          <Card title="Pending Approvals" value={pendingApprovals.toString()} icon={<MyDetailsIcon />} />
        </div>
      )}
    </div>
  );

  return (
    <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-brand-text-light mb-6">Here's a summary of today's activities.</p>
        
        {/* Admin/Manager/Head Widgets */}
        <div className="mb-6 md:mb-8">
            { (user?.roleIds.includes('admin') || user?.roleIds.includes('manager') || user?.roleIds.includes('head')) && renderAdminCards() }
        </div>

        {/* Student Widgets */}
         {user?.roleIds.includes('student') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <Card title="My Attendance" value={`${loggedInStudent?.attendance || 'N/A'}%`} icon={<StudentIcon />} />
                <Card title="My Pending Fees" value={`$${studentFee?.remaining_due.toLocaleString() || 0}`} icon={<FeeIcon />} />
            </div>
         )}
         
        {/* Faculty Widgets */}
        {user?.roleIds.includes('faculty') && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
               <Card title="Active Courses" value="3" icon={<CourseIcon />} />
               <Card title="Total Students" value="120" icon={<StudentIcon />} />
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
                {(user?.roleIds.includes('student') || user?.roleIds.includes('faculty')) ? <TodaysSchedule user={user} {...data} /> : <NoticeBoard notices={data.notices} />}
            </div>
            <div>
                 {(user?.roleIds.includes('student') || user?.roleIds.includes('faculty')) ? <NoticeBoard notices={data.notices} /> : (
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-subtle">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Quick Actions</h3>
                         <div className="space-y-3">
                            {can(Resource.FEES, Action.CREATE) && <button className="w-full text-left p-3 bg-brand-orange-light text-brand-orange-dark font-medium rounded-lg hover:bg-orange-200 transition-colors">Add Fee Entry</button>}
                            {can(Resource.STUDENTS, Action.CREATE) && <button className="w-full text-left p-3 bg-brand-orange-light text-brand-orange-dark font-medium rounded-lg hover:bg-orange-200 transition-colors">Add New Student</button>}
                            <button className="w-full text-left p-3 bg-brand-orange-light text-brand-orange-dark font-medium rounded-lg hover:bg-orange-200 transition-colors">Upload Document</button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default DashboardView;