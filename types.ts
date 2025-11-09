export enum Resource {
  DASHBOARD = 'DASHBOARD',
  COLLEGES = 'COLLEGES',
  ACADEMICS = 'ACADEMICS',
  FACULTY = 'FACULTY',
  STUDENTS = 'STUDENTS',
  FEES = 'FEES',
  TIMETABLE = 'TIMETABLE',
  INVENTORY = 'INVENTORY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  USERS = 'USERS',
  ROLES = 'ROLES',
  ADMIN = 'ADMIN',
  APPROVALS = 'APPROVALS',
  TEMPLATES = 'TEMPLATES',
  DATA_IMPORT = 'DATA_IMPORT',
}

export enum Action {
  CREATE = 'CREATE',
  READ = 'READ', // Includes list/view
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface Role {
  id: string;
  name: string;
  permissions: Partial<Record<Resource, Action[]>>;
}

export interface University {
  id: number;
  name: string;
}

export interface College {
  id: number;
  name: string;
  universityId: number;
}

export interface Department {
    id: number;
    name: string;
    collegeId: number;
}

export interface Program {
    id: number;
    name: string;
    departmentId: number;
    duration: string;
    isPublic?: boolean;
    category: 'School' | 'College';
}

export interface Course {
    id: number;
    code: string;
    name: string;
    programId: number;
    credits: number;
}

export interface Batch {
    id: number;
    programId: number;
    startYear: number;
    endYear: number;
}

export interface Section {
    id: number;
    name: string;
    batchId: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  roleIds: string[];
  roles: Role[]; // Populated at login time for easy access
  // Role-specific scopes
  universityId?: number; 
  collegeId?: number; 
  departmentId?: number;
}

export interface StudentProfile {
  id: number;
  userId: string;
  roll_no: string;
  sectionId: number;
  admission_date: string;
  fee_status: 'Paid' | 'Pending' | 'Partial';
  attendance: number;
}

export interface FacultyProfile {
    id: number;
    userId: string;
    departmentId: number;
    specialization: string;
}

export interface FeePlan {
    id: number;
    programId: number;
    batchStartYear: number;
    totalAmount: number;
}

export interface FeeComponent {
    id: number;
    feePlanId: number;
    name: 'Tuition' | 'Lab' | 'Library' | 'Hostel' | 'Transport' | 'Miscellaneous';
    amount: number;
}

export interface FeeReceipt {
  id: number;
  studentId: number; // This links to StudentProfile id
  studentName: string;
  amount_paid: number;
  payment_type: 'Cash' | 'DD' | 'Transfer';
  date: string;
  remaining_due: number;
  receipt_no: string;
}

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: 'Book' | 'Equipment' | 'Uniform' | 'Journal' | 'Lab Kit';
  status: 'Available' | 'Issued' | 'Maintenance';
  condition: 'New' | 'Good' | 'Fair' | 'Damaged';
}

export interface IssueRecord {
  id: number;
  inventoryItemId: number;
  studentId: number; // This links to StudentProfile id
  issue_date: string;
  due_date: string;
  return_date: string | null;
  signed_doc_url?: string;
  fine_amount?: number;
}

export interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
  // This can be refactored later to link to role IDs
  visible_to_roles: string[]; // e.g., ['admin', 'student']
  isPublic?: boolean;
  category: 'Exams' | 'Admissions' | 'Events' | 'General';
}

export interface TimetableSlot {
    id: number;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    time_slot: '9-10' | '10-11' | '11-12' | '12-1' | '2-3' | '3-4' | '4-5';
    sectionId: number;
    courseId: number;
    facultyId: string; // This links to User id
}

export interface AuditLog {
    id: number;
    timestamp: string;
    userId: string;
    action: string; // e.g., 'CREATE_STUDENT', 'UPDATE_FEE'
    details: Record<string, any>; // { studentId: 1, changes: { fee_status: 'Paid' } }
}

export interface Settings {
    appName: string;
    themeColor: string;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

export interface ApprovalRequest {
    id: number;
    type: 'Fee Waiver' | 'Leave Request' | 'Timetable Change' | 'Fine Waive';
    requesterId: string; // User ID
    details: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    date_submitted: string;
}

export interface DocumentTemplate {
    id: string; // e.g., 'student_id_card'
    name: string;
    config: {
        backgroundColor: string;
        logoUrl: string;
        title: string;
    };
}