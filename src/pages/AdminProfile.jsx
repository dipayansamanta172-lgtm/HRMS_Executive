import React, { useState, useEffect } from 'react';
import { Badge, Button } from '../components/UIElements';
import { useToast } from '../context/ToastContext';
import { Edit2, Check, X, UploadCloud, User } from 'lucide-react';
import { api } from '../services/api';
import styles from './EmployeeProfile.module.css';

export const AdminProfile = () => {
  const { showToast } = useToast();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBuffer, setEditBuffer] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await api.getEmployeeProfile();
        if (data) {
          setAdminData(data);
          setEditBuffer(data);
        }
      } catch (err) {
        console.error('Failed to load admin profile:', err);
        setAdminData(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEditClick = () => {
    setEditBuffer({ ...adminData });
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (!editBuffer.name?.trim() || !editBuffer.personal_email?.trim() || !editBuffer.phone?.trim()) {
      showToast('Name, Email, and Phone number are required fields.', 'danger');
      return;
    }
    
    try {
      // Map frontend fields to backend expected fields for updateMyProfile
      const payload = {
        personalEmail: editBuffer.personal_email,
        phone: editBuffer.phone,
        location: editBuffer.location,
        photo: editBuffer.photo
      };
      
      const response = await api.updateEmployeeProfile(payload);
      if (response.success) {
        // Refresh profile data from backend to ensure we have the latest isolated data
        const updatedProfile = await api.getEmployeeProfile();
        setAdminData(updatedProfile);
        setEditBuffer(updatedProfile);
        setIsEditMode(false);
        showToast('Admin Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to update admin profile:', err);
      showToast('Failed to update profile.', 'danger');
    }
  };

  const handleInputChange = (field, value) => {
    setEditBuffer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      showToast('Please upload a valid image (JPG, PNG, WebP).', 'danger');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast('Image size should be less than 5MB.', 'danger');
      return;
    }

    showToast('Uploading profile picture...', 'info');
    try {
      const response = await api.uploadProfilePicture(file);
      if (response.success && response.url) {
        const updatedProfile = await api.getEmployeeProfile();
        setAdminData(updatedProfile);
        if (isEditMode) {
           setEditBuffer(prev => ({ ...prev, photo: response.url }));
        }
        showToast('Profile picture uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
      const errMsg = err.response?.data?.message || 'Failed to upload image.';
      showToast(errMsg, 'danger');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontWeight: 600 }}>
        Loading profile...
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className={styles.container}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Profile</h2>
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
          No profile data available. Please complete setup.
        </div>
      </div>
    );
  }

  // Helper to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString([], { month: 'long', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Profile</h2>
        
        {/* View mode / Edit mode buttons */}
        {!isEditMode ? (
          <Button variant="outline" onClick={handleEditClick}>
            <Edit2 size={16} style={{ marginRight: '6px' }} />
            Edit Profile
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" onClick={handleCancelClick}>
              <X size={16} style={{ marginRight: '6px' }} />
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveClick}>
              <Check size={16} style={{ marginRight: '6px' }} />
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      {/* Profile Card header */}
      <div className={styles.profileCard}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {(isEditMode ? editBuffer.photo : adminData.photo) ? (
            <img 
              src={isEditMode ? editBuffer.photo : adminData.photo} 
              alt={adminData.name || 'Not provided'} 
              className={styles.avatar} 
            />
          ) : (
            <div className={styles.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
              <User size={32} />
            </div>
          )}
          
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: 'transparent',
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <UploadCloud size={14} style={{ marginRight: '4px' }} />
            Change Picture
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp" 
              onChange={handlePhotoUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '12px' }}>
          {isEditMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input 
                type="text" 
                value={editBuffer.name || ''} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.infoValue}
                style={{ fontSize: '1.05rem', fontWeight: 700, padding: '4px 8px', maxWidth: '240px' }}
                placeholder="Name (Cannot be changed here)"
                disabled
              />
            </div>
          ) : (
            <>
              <h3 className={styles.name}>{adminData.name || 'Not provided'}</h3>
              <p className={styles.role}>{adminData.designation || adminData.role || 'Not provided'}</p>
            </>
          )}
        </div>
        
        <div style={{ marginLeft: 'auto' }}>
          <Badge variant={adminData.status === 'Active' ? 'success' : 'warning'}>{adminData.status || 'Not provided'}</Badge>
        </div>
      </div>

      {/* Info grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Admin ID (Read-Only)</span>
          <span className={styles.infoValue} style={{ opacity: 0.75 }}>{adminData.employee_code || adminData.id || 'Not provided'}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Company ID</span>
          <span className={styles.infoValue}>{adminData.company_id || 'Not provided'}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Company Name</span>
          <span className={styles.infoValue}>{adminData.company_name || 'Not provided'}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Department</span>
          <span className={styles.infoValue}>{adminData.department || 'Not provided'}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email</span>
          {isEditMode ? (
            <input 
              type="email" 
              value={editBuffer.personal_email || ''}
              onChange={(e) => handleInputChange('personal_email', e.target.value)}
              className={styles.infoValue}
            />
          ) : (
            <span className={styles.infoValue}>{adminData.personal_email || 'Not provided'}</span>
          )}
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone Number</span>
          {isEditMode ? (
            <input 
              type="text" 
              value={editBuffer.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={styles.infoValue}
            />
          ) : (
            <span className={styles.infoValue}>{adminData.phone || 'Not provided'}</span>
          )}
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Join Date</span>
          <span className={styles.infoValue}>{formatDate(adminData.join_date)}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Address / Location</span>
          {isEditMode ? (
            <input 
              type="text" 
              value={editBuffer.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={styles.infoValue}
            />
          ) : (
            <span className={styles.infoValue}>{adminData.location || 'Not provided'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
