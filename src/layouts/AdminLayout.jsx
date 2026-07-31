import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Sidebar } from '../components/Sidebar';
import { api } from '../services/api';
import styles from './AdminLayout.module.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebar_collapsed', String(newState));
      return newState;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const data = await api.getEmployeeProfile();
        if (data) {
          if (data.user_role !== 'admin') {
            navigate('/employee/dashboard');
          } else {
            setProfile(data);
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch admin profile for layout:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  const handleFabClick = () => {
    navigate('/admin/employees?add=true');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        fontWeight: 600, 
        color: 'var(--text-muted)' 
      }}>
        Loading Admin Panel...
      </div>
    );
  }

  const employeeData = {
    name: profile?.name || 'Administrator',
    photo: profile?.photo || '',
    role: profile?.role || 'HR Admin',
    company_name: profile?.company_name || '',
    company_logo: profile?.company_logo || ''
  };

  return (
    <div className={styles.layout}>
      <Sidebar 
        userRole="admin" 
        employeeData={employeeData} 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div className={`${styles.contentWrapper} ${sidebarCollapsed ? styles.contentWrapperCollapsed : ''}`}>
        <Header 
          title="Executive" 
          userPhoto={employeeData.photo} 
          userRole="admin" 
        />
        
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      
      <BottomNav userRole="admin" onFabClick={handleFabClick} />
    </div>
  );
};

export default AdminLayout;
