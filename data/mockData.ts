import { User, StudentProfile, FeeReceipt, Notice, Program, College, Department, InventoryItem, IssueRecord, University, Course, Batch, Section, FacultyProfile, TimetableSlot, Role, Resource, Action, ApprovalRequest, DocumentTemplate } from '../types';

export const universities: University[] = [
    { id: 1, name: "Supreme Skills University" }
];

export const colleges: College[] = [
    { id: 1, name: "Grand Central University", universityId: 1 },
    { id: 2, name: "City Engineering College", universityId: 1 },
    { id: 3, name: "MLD School of Excellence", universityId: 1 },
];

export const departments: Department[] = [
    { id: 1, name: "School of Engineering", collegeId: 1 },
    { id: 2, name: "School of Arts & Sciences", collegeId: 1 },
    { id: 3, name: "Computer Science & Eng.", collegeId: 2 },
    { id: 4, name: "Electronics & Comm.", collegeId: 2 },
    { id: 5, name: "Senior Secondary", collegeId: 3},
];

export const programs: Program[] = [
    { id: 101, name: "B.Tech in Computer Science", departmentId: 1, duration: "4 Years", category: 'College', isPublic: true },
    { id: 102, name: "B.Tech in Mechanical Eng.", departmentId: 1, duration: "4 Years", category: 'College' },
    { id: 103, name: "B.Sc. in Physics", departmentId: 2, duration: "3 Years", category: 'College', isPublic: true },
    { id: 104, name: "B.E. in Computer Science", departmentId: 3, duration: "4 Years", category: 'College' },
    { id: 105, name: "Class 11-12 (Science)", departmentId: 5, duration: "2 Years", category: 'School', isPublic: true },
    { id: 106, name: "B.Sc. Nursing", departmentId: 2, duration: "4 Years", category: 'College', isPublic: true },
];

export const courses: Course[] = [
    { id: 1, code: 'CS101', name: 'Intro to Programming', programId: 101, credits: 4 },
    { id: 2, code: 'CS102', name: 'Data Structures', programId: 101, credits: 4 },
    { id: 3, code: 'ME101', name: 'Engineering Mechanics', programId: 102, credits: 3 },
    { id: 4, code: 'PH101', name: 'Classical Mechanics', programId: 103, credits: 4 },
    { id: 5, code: 'CSE101', name: 'Intro to C++', programId: 104, credits: 4 },
];

export const batches: Batch[] = [
    { id: 1, programId: 101, startYear: 2021, endYear: 2025 },
    { id: 2, programId: 102, startYear: 2020, endYear: 2024 },
    { id: 3, programId: 101, startYear: 2022, endYear: 2026 },
];

export const sections: Section[] = [
    { id: 1, name: 'A', batchId: 1 },
    { id: 2, name: 'B', batchId: 1 },
    { id: 3, name: 'A', batchId: 2 },
];

export const roles: Role[] = [
    {
        id: 'admin',
        name: 'Admin',
        permissions: {
            [Resource.DASHBOARD]: [Action.READ],
            [Resource.COLLEGES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.ACADEMICS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.FACULTY]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.STUDENTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.FEES]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.TIMETABLE]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.INVENTORY]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.REPORTS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.SETTINGS]: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
            [Resource.ADMIN]: [Action.READ, Action.UPDATE],
            [Resource.APPROVALS]: [Action.READ, Action.UPDATE],
            [Resource.TEMPLATES]: [Action.READ, Action.UPDATE],
            [Resource.DATA_IMPORT]: [Action.READ, Action.CREATE],
        }
    },
    {
        id: 'manager',
        name: 'Manager',
        permissions: {
            [Resource.DASHBOARD]: [Action.READ],
            [Resource.COLLEGES]: [Action.READ],
            [Resource.ACADEMICS]: [Action.READ],
            [Resource.FACULTY]: [Action.READ],
            [Resource.STUDENTS]: [Action.READ],
            [Resource.FEES]: [Action.READ],
        }
    },
    {
        id: 'head',
        name: 'Head',
        permissions: {
            [Resource.DASHBOARD]: [Action.READ],
            [Resource.ACADEMICS]: [Action.READ, Action.UPDATE],
            [Resource.FACULTY]: [Action.READ, Action.UPDATE],
            [Resource.STUDENTS]: [Action.CREATE, Action.READ, Action.UPDATE],
            [Resource.FEES]: [Action.CREATE, Action.READ, Action.UPDATE],
            [Resource.TIMETABLE]: [Action.READ, Action.UPDATE],
            [Resource.INVENTORY]: [Action.READ, Action.UPDATE],
        }
    },
    {
        id: 'faculty',
        name: 'Faculty',
        permissions: {
            [Resource.DASHBOARD]: [Action.READ],
            [Resource.ACADEMICS]: [Action.READ], // My Courses
            [Resource.TIMETABLE]: [Action.READ], // My Timetable
            [Resource.STUDENTS]: [Action.READ],
        }
    },
    {
        id: 'student',
        name: 'Student',
        permissions: {
            [Resource.DASHBOARD]: [Action.READ],
            // 'details' view, can be mapped to a resource later
            [Resource.TIMETABLE]: [Action.READ], // My Timetable
            // 'notices' view
            [Resource.INVENTORY]: [Action.READ], // Library
            [Resource.FEES]: [Action.READ],
        }
    }
];

export const users: User[] = [
  { id: '1', name: 'Admin Owner', email: 'admin@college.com', password: 'admin123', roleIds: ['admin'], roles: [], universityId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
  { id: '2', name: 'Manager One', email: 'manager1@college.com', password: 'demo123', roleIds: ['manager'], roles: [], collegeId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=manager1' },
  { id: '3', name: 'Manager Two', email: 'manager2@college.com', password: 'demo123', roleIds: ['manager'], roles: [], collegeId: 2, avatarUrl: 'https://i.pravatar.cc/150?u=manager2' },
  { id: '4', name: 'Dr. Evelyn Reed', email: 'head@college.com', password: 'demo123', roleIds: ['head'], roles: [], collegeId: 1, departmentId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=head' },
  { id: '5', name: 'Prof. Alan Grant', email: 'faculty@college.com', password: 'demo123', roleIds: ['faculty'], roles: [], collegeId: 1, departmentId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=faculty' },
  { id: '6', name: 'John Doe', email: 'student@college.com', password: 'demo123', roleIds: ['student'], roles: [], collegeId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=student' },
  { id: '7', name: 'Dr. Ian Malcolm', email: 'faculty2@college.com', password: 'demo123', roleIds: ['faculty'], roles: [], collegeId: 1, departmentId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=faculty2' },
  { id: '8', name: 'Jane Smith', email: 'student2@college.com', password: 'demo123', roleIds: ['student'], roles: [], collegeId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=student2' },
  { id: 'temp3', name: 'Bob Smith', email: 'student3@college.com', password: 'demo123', roleIds: ['student'], roles: [], collegeId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=student3' },
  { id: 'temp4', name: 'Charlie Brown', email: 'student4@college.com', password: 'demo123', roleIds: ['student'], roles: [], collegeId: 1, avatarUrl: 'https://i.pravatar.cc/150?u=student4' },
];

export const facultyProfiles: FacultyProfile[] = [
    { id: 1, userId: '5', departmentId: 1, specialization: 'Algorithms' },
    { id: 2, userId: '7', departmentId: 1, specialization: 'Data Structures' },
];

export const studentProfiles: StudentProfile[] = [
  { id: 1, userId: '6', roll_no: 'CSE21A01', sectionId: 1, admission_date: '2021-08-15', fee_status: 'Paid', attendance: 92 },
  { id: 2, userId: '8', roll_no: 'CSE21A02', sectionId: 1, admission_date: '2021-08-16', fee_status: 'Partial', attendance: 88 },
  { id: 3, userId: 'temp3', roll_no: 'ME20A01', sectionId: 3, admission_date: '2020-07-20', fee_status: 'Pending', attendance: 78 },
  { id: 4, userId: 'temp4', roll_no: 'CSE21B01', sectionId: 2, admission_date: '2021-09-01', fee_status: 'Paid', attendance: 85 },
];

export const feeReceipts: FeeReceipt[] = [
  { id: 1, studentId: 1, studentName: 'John Doe', amount_paid: 50000, payment_type: 'Cash', date: '2023-08-20', remaining_due: 0, receipt_no: 'R-2023-001' },
  { id: 2, studentId: 3, studentName: 'Bob Smith', amount_paid: 25000, payment_type: 'DD', date: '2023-08-22', remaining_due: 25000, receipt_no: 'R-2023-002' },
  { id: 3, studentId: 2, studentName: 'Jane Smith', amount_paid: 40000, payment_type: 'Transfer', date: '2023-09-05', remaining_due: 10000, receipt_no: 'R-2023-003' },
  { id: 4, studentId: 4, studentName: 'Charlie Brown', amount_paid: 55000, payment_type: 'Cash', date: '2023-08-18', remaining_due: 0, receipt_no: 'R-2023-004' },
];

export const notices: Notice[] = [
  { id: 1, title: 'Mid-Term Examinations Schedule', description: 'The schedule for the upcoming mid-term exams has been posted. Please check the main notice board.', date: '2023-10-10', visible_to_roles: ['student', 'faculty', 'head', 'manager', 'admin'], isPublic: true, category: 'Exams' },
  { id: 2, title: 'Annual Sports Day', description: 'Get ready for the annual sports day on Nov 15th! Registrations are open.', date: '2023-10-08', visible_to_roles: ['student', 'faculty', 'head'], isPublic: true, category: 'Events' },
  { id: 3, title: 'Faculty Meeting', description: 'A mandatory meeting for all faculty members of the CS department will be held on Oct 12th.', date: '2023-10-05', visible_to_roles: ['faculty', 'head'], category: 'General' },
  { id: 4, title: 'Admissions Open for 2024 Batch', description: 'Admissions for the next academic year are now open. Visit the admissions page for more details.', date: '2023-10-15', visible_to_roles: ['admin'], isPublic: true, category: 'Admissions' },
];

export const inventoryItems: InventoryItem[] = [
  { id: 1, sku: 'BOOK-ALG-001', name: 'Introduction to Algorithms', category: 'Book', status: 'Issued', condition: 'Good' },
  { id: 2, sku: 'BOOK-PHY-001', name: 'Fundamentals of Physics', category: 'Book', status: 'Available', condition: 'New' },
  { id: 3, sku: 'EQUIP-MIC-001', name: 'Microscope Model X', category: 'Equipment', status: 'Available', condition: 'Good' },
  { id: 4, sku: 'BOOK-DS-001', name: 'Data Structures & Algorithms', category: 'Book', status: 'Issued', condition: 'Fair' },
  { id: 5, sku: 'UNIF-LAB-L', name: 'Lab Coat - Large', category: 'Uniform', status: 'Available', condition: 'New' },
];

export const issueRecords: IssueRecord[] = [
  { id: 1, inventoryItemId: 1, studentId: 1, issue_date: '2023-09-01', due_date: '2023-10-01', return_date: null, signed_doc_url: 'path/to/doc1.jpg', fine_amount: 5 },
  { id: 2, inventoryItemId: 4, studentId: 3, issue_date: '2023-09-05', due_date: '2023-10-05', return_date: null, fine_amount: 0 },
  { id: 3, inventoryItemId: 2, studentId: 4, issue_date: '2023-08-15', due_date: '2023-09-15', return_date: '2023-09-10', fine_amount: 0 },
];

export const timetable: TimetableSlot[] = [
    { id: 1, day: 'Monday', time_slot: '9-10', sectionId: 1, courseId: 1, facultyId: '5'},
    { id: 2, day: 'Monday', time_slot: '10-11', sectionId: 1, courseId: 2, facultyId: '7'},
    { id: 3, day: 'Tuesday', time_slot: '9-10', sectionId: 1, courseId: 2, facultyId: '7'},
    { id: 4, day: 'Tuesday', time_slot: '11-12', sectionId: 1, courseId: 1, facultyId: '5'},
    { id: 5, day: 'Wednesday', time_slot: '2-3', sectionId: 1, courseId: 1, facultyId: '5'},
];

export const approvalRequests: ApprovalRequest[] = [
    { id: 1, type: 'Fee Waiver', requesterId: '6', details: 'Request for 50% waiver for John Doe (CSE21A01) due to scholarship.', status: 'Pending', date_submitted: '2023-10-15' },
    { id: 2, type: 'Leave Request', requesterId: '5', details: 'Prof. Alan Grant requests leave from Oct 20 to Oct 22 for a conference.', status: 'Pending', date_submitted: '2023-10-12' },
    { id: 3, type: 'Timetable Change', requesterId: '4', details: 'Request to swap CS101 and CS102 on Monday for Section A.', status: 'Approved', date_submitted: '2023-10-10' },
    { id: 4, type: 'Fine Waive', requesterId: '8', details: 'Waive $5 overdue fine for Jane Smith for "Intro to Algorithms".', status: 'Rejected', date_submitted: '2023-10-11' },
];

export const documentTemplates: DocumentTemplate[] = [
    {
        id: 'student_id_card',
        name: 'Student ID Card',
        config: {
            backgroundColor: '#ffffff',
            logoUrl: 'https://placehold.co/100x100/fb923c/ffffff?text=OS',
            title: 'Student Identity Card'
        }
    }
];