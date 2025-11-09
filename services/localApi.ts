import * as mockData from '../data/mockData';
import { Settings, ApprovalRequest, DocumentTemplate, Program, Notice } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const DB_KEY = 'collegeOsDb';

interface Database {
    universities: any[];
    colleges: any[];
    departments: any[];
    programs: Program[];
    courses: any[];
    batches: any[];
    sections: any[];
    roles: any[];
    users: any[];
    facultyProfiles: any[];
    studentProfiles: any[];
    feeReceipts: any[];
    notices: Notice[];
    inventoryItems: any[];
    issueRecords: any[];
    timetable: any[];
    settings: Settings;
    approvalRequests: ApprovalRequest[];
    documentTemplates: DocumentTemplate[];
    [key: string]: any;
}

// Function to get the entire database from localStorage
const getDb = (): Database => {
    const dbJson = localStorage.getItem(DB_KEY);
    return dbJson ? JSON.parse(dbJson) : seedDb();
};

// Function to save the entire database to localStorage
const saveDb = (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Seed the database from mock data if it doesn't exist
const seedDb = (): Database => {
    const db: Database = { 
        ...mockData, 
        settings: { appName: 'College OS', themeColor: '#FB923C' },
        approvalRequests: mockData.approvalRequests,
        documentTemplates: mockData.documentTemplates,
    };
    saveDb(db);
    return db;
};

export const init = () => {
    if (!localStorage.getItem(DB_KEY)) {
        seedDb();
    }
};

// Generic getter for any table
const getTable = async <T>(tableName: keyof Database): Promise<T[]> => {
    await delay(150); // Simulate network latency
    const db = getDb();
    return db[tableName] || [];
};

// API functions for each data type
export const getUniversities = () => getTable<any>('universities');
export const getColleges = () => getTable<any>('colleges');
export const getDepartments = () => getTable<any>('departments');
export const getPrograms = () => getTable<Program>('programs');
export const getCourses = () => getTable<any>('courses');
export const getBatches = () => getTable<any>('batches');
export const getSections = () => getTable<any>('sections');
export const getRoles = () => getTable<any>('roles');
export const getUsers = () => getTable<any>('users');
export const getFacultyProfiles = () => getTable<any>('facultyProfiles');
export const getStudentProfiles = () => getTable<any>('studentProfiles');
export const getFeeReceipts = () => getTable<any>('feeReceipts');
export const getNotices = () => getTable<Notice>('notices');
export const getInventoryItems = () => getTable<any>('inventoryItems');
export const getIssueRecords = () => getTable<any>('issueRecords');
export const getTimetable = () => getTable<any>('timetable');

// Public API simulations
export const getPublicPrograms = async (): Promise<Program[]> => {
    const programs = await getPrograms();
    return programs.filter(p => p.isPublic);
};

export const getPublicNotices = async (): Promise<Notice[]> => {
    const notices = await getNotices();
    return notices.filter(n => n.isPublic);
};


// Settings API
export const getSettings = async (): Promise<Settings> => {
    await delay(50);
    const db = getDb();
    return db.settings;
};

export const saveSettings = async (settings: Settings): Promise<Settings> => {
    await delay(100);
    const db = getDb();
    db.settings = settings;
    saveDb(db);
    return settings;
};

// Approval Requests API
export const getApprovalRequests = () => getTable<ApprovalRequest>('approvalRequests');

export const updateApprovalRequestStatus = async (id: number, status: 'Approved' | 'Rejected'): Promise<ApprovalRequest> => {
    await delay(200);
    const db = getDb();
    const requestIndex = db.approvalRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) throw new Error('Request not found');
    db.approvalRequests[requestIndex].status = status;
    saveDb(db);
    return db.approvalRequests[requestIndex];
};


// Document Templates API
export const getDocumentTemplates = () => getTable<DocumentTemplate>('documentTemplates');

export const getDocumentTemplate = async (id: string): Promise<DocumentTemplate | undefined> => {
    await delay(50);
    const db = getDb();
    return db.documentTemplates.find(t => t.id === id);
};

export const saveDocumentTemplate = async (template: DocumentTemplate): Promise<DocumentTemplate> => {
    await delay(100);
    const db = getDb();
    const templateIndex = db.documentTemplates.findIndex(t => t.id === template.id);
    if (templateIndex > -1) {
        db.documentTemplates[templateIndex] = template;
    } else {
        db.documentTemplates.push(template);
    }
    saveDb(db);
    return template;
};