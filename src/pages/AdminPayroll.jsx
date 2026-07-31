import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Badge, Button, Modal, Input } from '../components/UIElements';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import styles from './AdminPayroll.module.css';

export const AdminPayroll = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Payroll Budget States
  const [payrollBudget, setPayrollBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  // Salary Edit States
  const [editingSalaryEmp, setEditingSalaryEmp] = useState(null);
  const [salaryConfig, setSalaryConfig] = useState({
    basic_salary: '', hra: '', travel_allowance: '', medical_allowance: '', other_allowances: '',
    performance_bonus: '', provident_fund: '', professional_tax: '', other_deductions: ''
  });

  useEffect(() => {
    const fetchPayroll = async () => {
      setLoading(true);
      try {
        const [payrollData, budgetData] = await Promise.all([
          api.getAdminPayroll(),
          api.getPayrollBudget()
        ]);
        setEmployees(Array.isArray(payrollData) ? payrollData : []);
        setPayrollBudget(budgetData ? budgetData.budget : 0);
        setTempBudget(String(budgetData ? budgetData.budget : 0));
      } catch (err) {
        console.error('Failed to fetch payroll data:', err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  const handleSaveBudget = async () => {
    try {
      const numeric = parseFloat(tempBudget);
      if (isNaN(numeric) || numeric < 0) {
        showToast('Please enter a valid positive number for the budget.', 'warning');
        return;
      }
      const res = await api.updatePayrollBudget(numeric);
      setPayrollBudget(res.budget);
      setIsEditing(false);
      showToast('Payroll budget updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update budget:', err);
      showToast('Failed to save budget changes.', 'danger');
    }
  };

  const handleApproveEmployeePayroll = async (id) => {
    try {
      await api.approvePayroll(id);
      setEmployees(prev => prev.map(emp => {
        if (emp.id === id) {
          return { ...emp, status: 'Approved' };
        }
        return emp;
      }));
      showToast(`Payroll approved successfully!`, 'success');
    } catch (err) {
      console.error('Failed to approve payroll:', err);
      showToast('Failed to approve payroll. Please try again.', 'danger');
    }
  };

  const handleEditSalary = (emp) => {
    setEditingSalaryEmp(emp);
    setSalaryConfig({
      basic_salary: emp.basic_salary || 0,
      hra: emp.hra || 0,
      travel_allowance: emp.travel_allowance || 0,
      medical_allowance: emp.medical_allowance || 0,
      other_allowances: emp.other_allowances || 0,
      performance_bonus: emp.performance_bonus || 0,
      provident_fund: emp.provident_fund || 0,
      professional_tax: emp.professional_tax || 0,
      other_deductions: emp.other_deductions || 0,
    });
  };

  const handleSaveSalaryConfig = async (e) => {
    e.preventDefault();
    try {
      await api.updateSalaryComponents(editingSalaryEmp.id, salaryConfig);
      
      setEmployees(prev => prev.map(emp => {
        if (emp.id === editingSalaryEmp.id) {
          const basic = parseFloat(salaryConfig.basic_salary) || 0;
          const allowances = (parseFloat(salaryConfig.hra) || 0) + (parseFloat(salaryConfig.travel_allowance) || 0) + (parseFloat(salaryConfig.medical_allowance) || 0) + (parseFloat(salaryConfig.other_allowances) || 0) + (parseFloat(salaryConfig.performance_bonus) || 0);
          const deductions = (parseFloat(salaryConfig.provident_fund) || 0) + (parseFloat(salaryConfig.professional_tax) || 0) + (parseFloat(salaryConfig.other_deductions) || 0);
          const net = basic + allowances - deductions;
          return {
            ...emp,
            ...salaryConfig,
            salary: `$${net.toLocaleString()}`
          };
        }
        return emp;
      }));

      setEditingSalaryEmp(null);
      showToast('Salary configuration updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update salary config:', err);
      showToast('Failed to update salary configuration.', 'danger');
    }
  };

  const countApproved = employees.filter(e => e.status === 'Approved').length;
  const payrollStatus = employees.length === 0
    ? 'No Data'
    : countApproved === 0 
      ? 'Pending Approval' 
      : countApproved === employees.length 
        ? 'Fully Approved & Paid' 
        : `Partially Approved (${countApproved}/${employees.length})`;

  const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Payroll Management</h2>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Budget</span>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>$</span>
              <input 
                type="number" 
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                style={{
                  width: '120px',
                  padding: '6px 10px',
                  fontSize: '0.9rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              <Button variant="primary" onClick={handleSaveBudget} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                Save
              </Button>
              <Button variant="outline" onClick={() => { setIsEditing(false); setTempBudget(String(payrollBudget)); }} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                Cancel
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <span className={styles.statVal}>
                ${payrollBudget.toLocaleString()}
              </span>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  textDecoration: 'underline'
                }}
              >
                Edit Budget
              </button>
            </div>
          )}
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Status</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '4px' }}>
            {payrollStatus}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.cardTitle}>{currentMonthYear} Run</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Loading payroll data...
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            No payroll records available.
          </div>
        ) : (
          <div className={styles.list}>
            {employees.map((emp) => (
              <div key={emp.id} className={styles.item}>
                <div className={styles.empMeta}>
                  {emp.photo && (
                    <img src={emp.photo} alt={emp.name} className={styles.avatar} />
                  )}
                  <div className={styles.empDetails}>
                    <span className={styles.empName}>{emp.name}</span>
                    <span className={styles.empRole}>{emp.role}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className={styles.amountSection}>
                    <span className={styles.amount}>{emp.salary || '--'}</span>
                    <Badge variant={emp.status === 'Approved' ? 'success' : 'warning'}>
                      {emp.status || 'Pending'}
                    </Badge>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                      variant="outline"
                      onClick={() => handleEditSalary(emp)}
                      style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Salary Config"
                    >
                      <Pencil size={16} />
                    </Button>
                    {emp.status !== 'Approved' ? (
                      <Button 
                        variant="primary" 
                        onClick={() => handleApproveEmployeePayroll(emp.id)} 
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        disabled 
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Approved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Salary Modal */}
      <Modal
        isOpen={!!editingSalaryEmp}
        onClose={() => setEditingSalaryEmp(null)}
        title={`Salary Configuration - ${editingSalaryEmp?.name}`}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="outline" onClick={() => setEditingSalaryEmp(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSalaryConfig}>
              Save Config
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSaveSalaryConfig} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Earnings</h4>
          </div>
          <Input 
            label="Base Salary" 
            type="number"
            value={salaryConfig.basic_salary} 
            onChange={(e) => setSalaryConfig({...salaryConfig, basic_salary: e.target.value})} 
            required 
          />
          <Input 
            label="HRA" 
            type="number"
            value={salaryConfig.hra} 
            onChange={(e) => setSalaryConfig({...salaryConfig, hra: e.target.value})} 
          />
          <Input 
            label="Travel Allowance" 
            type="number"
            value={salaryConfig.travel_allowance} 
            onChange={(e) => setSalaryConfig({...salaryConfig, travel_allowance: e.target.value})} 
          />
          <Input 
            label="Medical Allowance" 
            type="number"
            value={salaryConfig.medical_allowance} 
            onChange={(e) => setSalaryConfig({...salaryConfig, medical_allowance: e.target.value})} 
          />
          <Input 
            label="Other Allowances" 
            type="number"
            value={salaryConfig.other_allowances} 
            onChange={(e) => setSalaryConfig({...salaryConfig, other_allowances: e.target.value})} 
          />
          <Input 
            label="Performance Bonus" 
            type="number"
            value={salaryConfig.performance_bonus} 
            onChange={(e) => setSalaryConfig({...salaryConfig, performance_bonus: e.target.value})} 
          />

          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Deductions</h4>
          </div>
          <Input 
            label="Provident Fund (PF)" 
            type="number"
            value={salaryConfig.provident_fund} 
            onChange={(e) => setSalaryConfig({...salaryConfig, provident_fund: e.target.value})} 
          />
          <Input 
            label="Professional Tax" 
            type="number"
            value={salaryConfig.professional_tax} 
            onChange={(e) => setSalaryConfig({...salaryConfig, professional_tax: e.target.value})} 
          />
          <Input 
            label="Other Deductions" 
            type="number"
            value={salaryConfig.other_deductions} 
            onChange={(e) => setSalaryConfig({...salaryConfig, other_deductions: e.target.value})} 
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminPayroll;
