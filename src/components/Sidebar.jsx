import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Users, 
  CalendarDays, 
  Wallet, 
  LayoutGrid, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { api } from '../services/api';
import styles from './Sidebar.module.css';

export const Sidebar = ({ userRole = "employee", employeeData, isCollapsed, onToggle }) => {
  const navigate = useNavigate();

  // Primary navigation links (excluding profile, which goes to the bottom)
  const links = userRole === "admin"
    ? [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/attendance", label: "Attendance", icon: CheckSquare },
        { path: "/admin/employees", label: "Employees", icon: Users },
        { path: "/admin/departments", label: "Departments", icon: LayoutGrid },
        { path: "/admin/leaves", label: "Leaves Approval", icon: CalendarDays },
        { path: "/admin/payroll", label: "Payroll Run", icon: Wallet }
      ]
    : [
        { path: "/employee/dashboard", label: "Dashboard", icon: Home },
        { path: "/employee/attendance", label: "Attendance", icon: CheckSquare },
        { path: "/employee/leave", label: "Leaves", icon: CalendarDays },
        { path: "/employee/salary", label: "Salary slips", icon: Wallet }
      ];

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Ignore API fail on client logout cleanup
    }
    localStorage.removeItem('hrms_token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate(userRole === 'admin' ? '/admin/profile' : '/employee/profile');
  };

  const brandName = employeeData?.company_name || "Executive";

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.topSection}>
        <div className={styles.brandRow}>
          <Link 
            to={links[0].path} 
            className={styles.brand} 
            style={{ 
              opacity: isCollapsed ? 0 : 1, 
              pointerEvents: isCollapsed ? 'none' : 'auto', 
              width: isCollapsed ? 0 : 'auto', 
              overflow: 'hidden',
              transition: 'all 0.2s ease'
            }}
          >
            {employeeData?.company_logo ? (
              <img src={employeeData.company_logo} alt={brandName} className={styles.brandIcon} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: '4px' }} />
            ) : (
              <div className={styles.brandIcon}>
                <LayoutGrid size={24} strokeWidth={2.5} />
              </div>
            )}
            <span>{brandName}</span>
          </Link>
          <button 
            type="button"
            className={styles.collapseBtn} 
            onClick={onToggle} 
            title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className={styles.navList}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''} ${isCollapsed ? styles.navItemCollapsed : ''}`
                }
                title={isCollapsed ? link.label : undefined}
              >
                <Icon size={18} />
                <span className={styles.navLabel} style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        {/* Profile Card */}
        {employeeData && (
          <div className={`${styles.profileCard} ${isCollapsed ? styles.profileCardCollapsed : ''}`} onClick={handleProfileClick} title={isCollapsed ? "Profile" : undefined}>
            <img src={employeeData.photo || '/avatar_placeholder.png'} alt={employeeData.name} className={styles.avatar} />
            <div className={styles.meta} style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto', overflow: 'hidden' }}>
              <span className={styles.name}>{employeeData.name}</span>
              <span className={styles.role}>
                {userRole === 'admin' ? 'HR Administrator' : employeeData.role}
              </span>
            </div>
          </div>
        )}

        {/* Action row containing Settings and Logout */}
        <div className={styles.bottomActions}>
          <NavLink 
            to={userRole === 'admin' ? '/admin/profile' : '/employee/profile'} 
            className={({ isActive }) => `${styles.bottomActionItem} ${isActive ? styles.bottomActionActive : ''} ${isCollapsed ? styles.navItemCollapsed : ''}`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings size={18} />
            <span className={styles.navLabel} style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}>
              Settings
            </span>
          </NavLink>
          
          <button type="button" className={`${styles.logoutBtn} ${isCollapsed ? styles.navItemCollapsed : ''}`} onClick={handleLogout} title={isCollapsed ? "Log Out" : undefined}>
            <LogOut size={18} />
            <span className={styles.navLabel} style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}>
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
