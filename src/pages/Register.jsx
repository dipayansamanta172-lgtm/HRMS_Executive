import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Building2, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/UIElements';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import styles from './Login.module.css';

export const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('employee'); // 'employee' | 'admin'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.register({ companyName, name, email, phone, password, role });
      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Top-Left Back Button */}
      <button 
        type="button" 
        className={styles.backButton} 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className={styles.splitContainer}>
        {/* Left Pane - Editorial Heading */}
        <div className={styles.leftPane}>
          <h1 className={styles.welcomeHeading}>Create your Executive Account</h1>
          <p className={styles.welcomeDesc}>
            Configure your enterprise workspace, organizational departments, and payroll target budgets.
          </p>
        </div>

        {/* Right Pane - Premium Sign Up Card */}
        <div className={styles.rightPane}>
          <div className={styles.card} style={{ maxWidth: '520px', padding: '40px 32px' }}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Register</h2>
              <p className={styles.subtitle}>Configure new business directory</p>
            </div>

            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form className={styles.form} onSubmit={handleRegister}>
              <Input
                label="Full Name"
                type="text"
                placeholder="Alex Pierce"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Company Name"
                type="text"
                placeholder="Enterprise Corp"
                icon={Building2}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="+1 (555) 019-2834"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              {/* Perspective Role Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Account Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '12px',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Employer / HR Admin</option>
                </select>
              </div>

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                icon={Lock}
                rightIcon={showPassword ? EyeOff : Eye}
                onRightIconClick={() => setShowPassword(!showPassword)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
              </Button>
            </form>

            <div className={styles.divider}></div>

            <div className={styles.registerRow}>
              <span>Already have an account?</span>
              <Link to="/login" className={styles.registerLink}>Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
