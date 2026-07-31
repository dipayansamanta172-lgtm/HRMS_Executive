import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RecentActivityList from '../components/RecentActivityList';
import styles from './AdminActivity.module.css';

export const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await api.getAllAdminActivity();
        setActivities(data || []);
      } catch (err) {
        console.error('Failed to load full activity logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.severity === filter);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Activity Logs</h2>
        <div className={styles.filters}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className={styles.select}
          >
            <option value="all">All Events</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading...
        </div>
      ) : (
        <RecentActivityList 
          title={`Activity History (${filteredActivities.length})`}
          activities={filteredActivities}
        />
      )}
    </div>
  );
};

export default AdminActivity;
