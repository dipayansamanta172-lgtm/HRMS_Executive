import axios from 'axios';

// API Client initialization
// Connects to the Node.js + Express.js backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // ─── Auth Operations ───────────────────────────────────────────────────────
  login: async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await client.post('/auth/register', userData);
    return res.data;
  },

  // ─── Employee Operations ───────────────────────────────────────────────────
  getEmployeeProfile: async () => {
    const res = await client.get('/employees/me');
    return res.data;
  },

  getEmployeeStats: async () => {
    const res = await client.get('/employees/me/stats');
    return res.data;
  },

  updateEmployeeProfile: async (profileData) => {
    const res = await client.put('/employees/me', profileData);
    return res.data;
  },

  // ─── Admin Operations ──────────────────────────────────────────────────────
  getAdminStats: async () => {
    const res = await client.get('/admin/stats');
    return res.data;
  },

  getAdminActivity: async () => {
    const res = await client.get('/admin/activity');
    return res.data;
  },

  getAllAdminActivity: async () => {
    const res = await client.get('/admin/activity/all');
    return res.data;
  },

  getEmployeeActivity: async () => {
    const res = await client.get('/employees/me/activity');
    return res.data;
  },

  getEmployees: async (filters = {}) => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.department) params.department = filters.department;
    const res = await client.get('/employees', { params });
    return res.data;
  },

  getEmployeeById: async (id) => {
    const res = await client.get(`/employees/${id}`);
    return res.data;
  },

  addEmployee: async (employeeData) => {
    const res = await client.post('/employees', employeeData);
    return res.data;
  },

  updateEmployee: async (id, employeeData) => {
    const res = await client.put(`/employees/${id}`, employeeData);
    return res.data;
  },

  getStaffStats: async () => {
    const res = await client.get('/admin/staff-stats');
    return res.data;
  },

  // ─── Department Operations ───────────────────────────────────────────────────
  getDepartments: async () => {
    const res = await client.get('/departments');
    return res.data;
  },

  createDepartment: async (deptData) => {
    const res = await client.post('/departments', deptData);
    return res.data;
  },

  updateDepartment: async (id, deptData) => {
    const res = await client.put(`/departments/${id}`, deptData);
    return res.data;
  },

  deleteDepartment: async (id) => {
    const res = await client.delete(`/departments/${id}`);
    return res.data;
  },

  // ─── Attendance Operations ─────────────────────────────────────────────────
  getAttendance: async (params = {}) => {
    const res = await client.get('/attendance', { params });
    return res.data;
  },

  getAttendanceByDate: async (date) => {
    const res = await client.get('/attendance/by-date', { params: { date } });
    return res.data;
  },

  getMyAttendance: async (params = {}) => {
    const res = await client.get('/attendance/me', { params });
    return res.data;
  },

  checkIn: async () => {
    const res = await client.post('/attendance/check-in');
    return res.data;
  },

  checkOut: async () => {
    const res = await client.post('/attendance/check-out');
    return res.data;
  },

  updateAttendanceStatus: async (id, status, date) => {
    const res = await client.put(`/attendance/${id}/status`, { status, date });
    return res.data;
  },

  // ─── Leave Operations ──────────────────────────────────────────────────────
  getLeaves: async (params = {}) => {
    const res = await client.get('/leaves', { params });
    return res.data;
  },

  getMyLeaves: async () => {
    const res = await client.get('/leaves/me');
    return res.data;
  },

  applyLeave: async (leaveData) => {
    const res = await client.post('/leaves', leaveData);
    return res.data;
  },

  updateLeaveStatus: async (leaveId, status) => {
    const res = await client.put(`/leaves/${leaveId}/status`, { status });
    return res.data;
  },

  getTeamAvailability: async () => {
    const res = await client.get('/leaves/team-availability');
    return res.data;
  },

  // ─── Payroll Operations ────────────────────────────────────────────────────
  getPayroll: async () => {
    const res = await client.get('/payroll/me');
    return res.data;
  },

  getAdminPayroll: async () => {
    const res = await client.get('/payroll');
    return res.data;
  },

  approvePayroll: async (employeeId, payload) => {
    const res = await client.put(`/payroll/${employeeId}/approve`, payload);
    return res.data;
  },

  updateSalaryComponents: async (employeeId, components) => {
    const res = await client.put(`/payroll/${employeeId}/salary`, components);
    return res.data;
  },

  getPayrollBudget: async () => {
    const res = await client.get('/payroll/budget');
    return res.data;
  },

  updatePayrollBudget: async (budget) => {
    const res = await client.put('/payroll/budget', { budget });
    return res.data;
  },

  // ─── Notifications ─────────────────────────────────────────────────────────
  getNotifications: async () => {
    const res = await client.get('/notifications');
    return res.data;
  },

  markNotificationRead: async (id) => {
    const res = await client.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await client.put('/notifications/mark-all-read');
    return res.data;
  },

  clearAllNotifications: async () => {
    const res = await client.delete('/notifications');
    return res.data;
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default api;
