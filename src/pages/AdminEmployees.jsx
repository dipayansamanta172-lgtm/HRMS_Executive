import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { Button, Input, Modal } from '../components/UIElements';
import EmployeeCard from '../components/EmployeeCard';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import styles from './AdminEmployees.module.css';

export const AdminEmployees = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [staffStats, setStaffStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for new employee
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [designation, setDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [baseSalary, setBaseSalary] = useState('');
  const [managerId, setManagerId] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    // Check if '?add=true' query parameter is present to open the modal
    if (searchParams.get('add') === 'true') {
      setModalOpen(true);
      // Clean query parameter after opening
      setSearchParams({});
    }

    const fetchEmployees = async () => {
      try {
        const list = await api.getEmployees({ search: searchQuery, department: selectedDept });
        setEmployees(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setEmployees([]);
      }
    };

    const fetchStaffStats = async () => {
      try {
        const data = await api.getStaffStats();
        setStaffStats(data || null);
      } catch (err) {
        console.error('Failed to fetch staff stats:', err);
        setStaffStats(null);
      }
    };

    const fetchDepartments = async () => {
      try {
        const list = await api.getDepartments();
        const activeDepts = Array.isArray(list) ? list.filter(d => d.status === 'Active') : [];
        setDepartments(activeDepts);
        if (activeDepts.length > 0 && !dept) {
          setDept(activeDepts[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchEmployees();
    fetchStaffStats();
    fetchDepartments();
  }, [searchParams, setSearchParams, searchQuery, selectedDept]);

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Invalid phone number format.', 'danger');
      return;
    }

    const fullPhone = `${countryCode} ${phone.trim()}`;

    const newEmp = {
      name,
      role,
      department: dept,
      email,
      phone: fullPhone,
      designation,
      employmentType,
      baseSalary,
      managerId: managerId || null,
      photo: photo || null,
    };

    try {
      const res = await api.addEmployee(newEmp);
      if (res.success || res.employee) {
        setEmployees([...employees, res.employee || res]);
        setModalOpen(false);
        setName('');
        setRole('');
        setEmail('');
        setPhoto('');
        setPhone('');
        setDesignation('');
        setBaseSalary('');
        setManagerId('');
        setSuccessData(res.employee || res);
        showToast('New employee added successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to add employee:', err);
      const errMsg = err.response?.data?.message || 'Failed to add employee. Please try again.';
      showToast(errMsg, 'danger');
    }
  };

  const handleToggleStatus = async (emp) => {
    const updated = employees.map(item => {
      if (item.id === emp.id) {
        return {
          ...item,
          status: item.status === 'Active' ? 'On Leave' : 'Active'
        };
      }
      return item;
    });
    setEmployees(updated);
  };

  const handleViewEmployee = (emp) => {
    navigate(`/admin/employees/${emp.id}`);
  };

  const handleEditEmployee = (emp) => {
    navigate(`/admin/employees/${emp.id}`);
  };

  return (
    <div className={styles.container}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Staff Directory</h2>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search by name, role, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className={styles.select}
            style={{ padding: '10px' }}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          
          <button 
            type="button" 
            className={styles.filterBtn}
            onClick={() => setSelectedDept('')}
          >
            <SlidersHorizontal size={16} />
            <span>Reset</span>
          </button>
        </div>

        <Button 
          variant="primary" 
          onClick={() => setModalOpen(true)}
          fullWidth
        >
          <Plus size={18} />
          Add Employee
        </Button>
      </div>

      {/* Staff Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statHeader}>Total Staff</span>
          <div className={styles.statValueWrapper}>
            <span className={styles.statValue}>{staffStats?.totalStaff ?? '--'}</span>
            {staffStats?.totalStaffChange && (
              <span className={styles.statChange}>{staffStats.totalStaffChange}</span>
            )}
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statHeader}>Active Now</span>
          <div className={styles.statValueWrapper}>
            <span className={styles.statValue}>{staffStats?.activeNow ?? '--'}</span>
            {staffStats?.activeNowRate && (
              <span className={styles.statChange} style={{ color: 'var(--success)' }}>
                {staffStats.activeNowRate}
              </span>
            )}
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statHeader}>On Leave</span>
          <div className={styles.statValueWrapper}>
            <span className={styles.statValue}>{staffStats?.onLeave ?? '--'}</span>
            {staffStats?.onLeaveRate && (
              <span className={styles.statChange} style={{ color: 'var(--danger)' }}>
                {staffStats.onLeaveRate}
              </span>
            )}
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statHeader}>New Hires</span>
          <div className={styles.statValueWrapper}>
            <span className={styles.statValue}>{staffStats?.newHires ?? '--'}</span>
            <span className={styles.statChange} style={{ color: 'var(--info)' }}>MTD</span>
          </div>
        </div>
      </div>

      {/* Employee List Section */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>All Employees</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {employees.length} records
          </span>
        </div>
        
        <div className={styles.employeeGrid}>
          {employees.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '48px 24px', 
              color: 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              No employees found.
            </div>
          ) : (
            employees.map((emp) => (
              <EmployeeCard 
                key={emp.id}
                employee={emp}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleToggleStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Employee"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEmployeeSubmit}>
              Save Employee
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleAddEmployeeSubmit}>
          <Input 
            label="Full Name" 
            placeholder="Sarah Jenkins" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="sarah.jenkins@company.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="System Role (Admin/Employee)" 
            placeholder="Employee" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
          />
          <Input 
            label="Designation / Job Title" 
            placeholder="Sr. Product Designer" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            required 
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                className={styles.select}
                style={{ width: '100px', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <div style={{ flex: 1 }}>
                <Input 
                  type="tel"
                  placeholder="9876543210" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Employment Type</label>
            <select 
              value={employmentType} 
              onChange={(e) => setEmploymentType(e.target.value)}
              className={styles.select}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <Input 
            label="Base Salary (Monthly)" 
            type="number"
            placeholder="5000" 
            value={baseSalary} 
            onChange={(e) => setBaseSalary(e.target.value)} 
            required 
          />
          <Input 
            label="Manager ID" 
            placeholder="Manager's Employee ID (Optional)" 
            value={managerId} 
            onChange={(e) => setManagerId(e.target.value)} 
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Department</label>
            {departments.length === 0 ? (
              <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-input)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>No departments have been created yet.</p>
                <Button variant="outline" onClick={() => navigate('/admin/departments')} style={{ width: '100%' }}>
                  <Plus size={16} /> Create Department
                </Button>
              </div>
            ) : (
              <select 
                value={dept} 
                onChange={(e) => setDept(e.target.value)}
                className={styles.select}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>
          <Input 
            label="Avatar Photo URL (Optional)" 
            placeholder="https://..." 
            value={photo} 
            onChange={(e) => setPhoto(e.target.value)} 
          />
        </form>
      </Modal>

      {/* Success Credentials Modal */}
      <Modal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        title="Employee Created Successfully"
        footer={
          <Button variant="primary" onClick={() => setSuccessData(null)} fullWidth>
            Done
          </Button>
        }
      >
        {successData && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Please share these temporary credentials with the employee securely. They will be prompted to change their password upon first login.</p>
            <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Employee ID</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{successData.employee_code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email (Username)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{successData.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Password</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{successData.tempPassword}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              fullWidth 
              style={{ marginTop: '24px' }}
              onClick={() => {
                navigator.clipboard.writeText(`Employee ID: ${successData.employee_code}\nEmail: ${successData.email}\nPassword: ${successData.tempPassword}`);
                showToast('Credentials copied to clipboard!', 'success');
              }}
            >
              Copy Credentials
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEmployees;
