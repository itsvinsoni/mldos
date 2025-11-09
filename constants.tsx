import React from 'react';
import { Resource } from './types';
import { DashboardIcon, CollegeIcon, CourseIcon, FeeIcon, StudentIcon, FacultyIcon, LibraryIcon, ReportIcon, SettingIcon, MyDetailsIcon, TimetableIcon, UploadIcon } from './components/Icons';

interface NavItem {
  name: string;
  icon: React.ReactElement;
  view: string;
  resource: Resource;
  // For role-specific naming, e.g., "My Courses" for Faculty
  roleNames?: { [roleId: string]: string }; 
}

export const ALL_NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard', resource: Resource.DASHBOARD },
  { name: 'Colleges', icon: <CollegeIcon />, view: 'colleges', resource: Resource.COLLEGES },
  { name: 'Academics', icon: <CourseIcon />, view: 'courses', resource: Resource.ACADEMICS, roleNames: { faculty: 'My Courses' } },
  { name: 'Faculty', icon: <FacultyIcon />, view: 'faculty', resource: Resource.FACULTY },
  { name: 'Students', icon: <StudentIcon />, view: 'students', resource: Resource.STUDENTS },
  { name: 'Fees', icon: <FeeIcon />, view: 'fees', resource: Resource.FEES },
  { name: 'Timetable', icon: <TimetableIcon />, view: 'timetable', resource: Resource.TIMETABLE, roleNames: { faculty: 'My Timetable', student: 'My Timetable' } },
  { name: 'Inventory', icon: <LibraryIcon />, view: 'inventory', resource: Resource.INVENTORY, roleNames: { student: 'Library' } },
  { name: 'Reports', icon: <ReportIcon />, view: 'reports', resource: Resource.REPORTS },
  { name: 'Approvals', icon: <MyDetailsIcon />, view: 'approvals', resource: Resource.ADMIN },
  { name: 'Templates', icon: <ReportIcon />, view: 'templates', resource: Resource.ADMIN },
  { name: 'Data Import', icon: <UploadIcon />, view: 'import', resource: Resource.ADMIN },
  { name: 'Settings', icon: <SettingIcon />, view: 'settings', resource: Resource.ADMIN },
];

export const BOTTOM_NAV_VIEWS = ['dashboard', 'students', 'fees', 'inventory'];