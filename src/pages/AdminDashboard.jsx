import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IdCard, 
  CheckCircle, 
  Calendar, 
  Banknote, 
  ShieldCheck, 
  FileText, 
  Megaphone, 
  MoreHorizontal 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import RecentActivityList from '../components/RecentActivityList';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import styles from './AdminDashboard.module.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, actRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminActivity(),
        ]);
        setStats(statsRes || null);
        setActivities(Array.isArray(actRes) ? actRes : []);
      } catch (err) {
        console.error('Admin dashboard loading error:', err);
        setStats(null);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleActionClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontWeight: 600 }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Welcome Message */}
      <div className={styles.welcomeSection}>
        <span className={styles.welcomeSub}>Welcome back,</span>
        <h2 className={styles.welcomeTitle}>{stats?.companyName || 'Admin'}</h2>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <StatCard 
          icon={IdCard}
          value={stats?.totalEmployees ?? '--'}
          label="Total Employees"
          change={stats?.totalEmployeesChange ?? ''}
          iconVariant="primary"
        />
        <StatCard 
          icon={CheckCircle}
          value={stats?.presentToday ?? '--'}
          label="Present Today"
          change={stats?.presentTodayRate ?? ''}
          iconVariant="success"
        />
        <StatCard 
          icon={Calendar}
          value={stats?.pendingLeaves ?? '--'}
          label="Pending Leaves"
          iconVariant="danger"
        />
        <StatCard 
          icon={Banknote}
          value={stats?.monthlyPayroll ?? '--'}
          label="Monthly Payroll"
          theme="indigo"
          iconVariant="warning"
        />
      </div>

      {/* Attendance Trends SVG Chart */}
      <TrendChart />

      {/* Recent Activity List */}
      <RecentActivityList 
        title="Recent Activity" 
        activities={activities} 
        interactive={false}
        onViewAll={() => navigate('/admin/activity')}
      />
    </div>
  );
};

export default AdminDashboard;
