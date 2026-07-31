import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Button, Input, Modal } from '../components/UIElements';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import styles from './AdminDepartments.module.css';

export const AdminDepartments = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [description, setDescription] = useState('');
  const [departmentHead, setDepartmentHead] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptData, empData] = await Promise.all([
        api.getDepartments(),
        api.getEmployees()
      ]);
      setDepartments(Array.isArray(deptData) ? deptData : []);
      setEmployees(Array.isArray(empData) ? empData : []);
    } catch (err) {
      console.error('Failed to load departments', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDept(null);
    setName('');
    setDepartmentCode('');
    setDescription('');
    setDepartmentHead('');
    setStatus('Active');
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setDepartmentCode(dept.department_code);
    setDescription(dept.description || '');
    setDepartmentHead(dept.department_head || '');
    setStatus(dept.status || 'Active');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !departmentCode) {
      showToast('Name and code are required', 'danger');
      return;
    }

    const payload = {
      name,
      department_code: departmentCode,
      description,
      department_head: departmentHead || null,
      status
    };

    try {
      if (editingDept) {
        await api.updateDepartment(editingDept.id, payload);
        showToast('Department updated successfully', 'success');
      } else {
        await api.createDepartment(payload);
        showToast('Department created successfully', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save department', 'danger');
    }
  };

  const handleDelete = async (dept) => {
    if (dept.employee_count > 0) {
      showToast(`This department cannot be deleted because it currently has ${dept.employee_count} employee(s). Please reassign those employees before deleting the department.`, 'danger');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
      try {
        await api.deleteDepartment(dept.id);
        showToast('Department deleted successfully', 'success');
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete department', 'danger');
      }
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.department_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Departments</h2>
        <div className={styles.actions}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button variant="primary" onClick={openAddModal}>
            <Plus size={18} />
            Create Department
          </Button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Users size={48} />
          </div>
          <h3 className={styles.emptyTitle}>No departments have been created yet.</h3>
          <p className={styles.emptyDesc}>Get started by creating your first company department.</p>
          <Button variant="primary" onClick={openAddModal}>
            <Plus size={18} /> Create Department
          </Button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Code</th>
                <th>Department Head</th>
                <th>Employees</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dept => (
                <tr key={dept.id}>
                  <td>
                    <div className={styles.deptName}>{dept.name}</div>
                    {dept.description && <div className={styles.deptDesc}>{dept.description}</div>}
                  </td>
                  <td><span className={styles.badge}>{dept.department_code}</span></td>
                  <td>{dept.department_head_name || <span className={styles.muted}>Not Assigned</span>}</td>
                  <td>
                    <div className={styles.employeeCount}>
                      <Users size={14} />
                      {dept.employee_count || 0}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${dept.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                      {dept.status || 'Active'}
                    </span>
                  </td>
                  <td>{new Date(dept.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.iconBtn} onClick={() => openEditModal(dept)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={`${styles.iconBtn} ${styles.deleteBtn}`} 
                        onClick={() => handleDelete(dept)} 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create Department'}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingDept ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            label="Department Name" 
            placeholder="e.g. Engineering" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Department Code" 
            placeholder="e.g. ENG" 
            value={departmentCode} 
            onChange={(e) => setDepartmentCode(e.target.value.toUpperCase())} 
            required 
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Description (Optional)</label>
            <textarea 
              className={styles.textarea}
              placeholder="Brief description of this department..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Department Head (Optional)</label>
            <select 
              className={styles.select}
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
            >
              <option value="">-- None --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select 
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDepartments;
